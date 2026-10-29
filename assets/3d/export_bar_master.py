import bpy
import os

out_dir = r"d:\PRACA\ARTBAR\ARTBAR NEW WEB\assets\3d"
blend_file = r"d:\PRACA\ARTBAR\artbar anim na strone\animacje na www.blend"
tex_composite_path = os.path.join(out_dir, "plansza_composite.png")
out_glb = os.path.join(out_dir, "bar_animated.glb")

# STEP 1: Open Blender file and set frame 71 (assembled bar)
bpy.ops.wm.open_mainfile(filepath=blend_file)
scene = bpy.context.scene
scene.frame_set(71)
bpy.context.view_layer.update()

# STEP 2: Fix PLANSZA.001 UVs and Material
plansza = bpy.data.objects['PLANSZA.001']
mesh = plansza.data

# Remove secondary automap layer, keep only UVMap
while len(mesh.uv_layers) > 1:
    mesh.uv_layers.remove(mesh.uv_layers[1])
uv_layer = mesh.uv_layers[0]
uv_layer.name = 'UVMap'
uv_data = uv_layer.data

# Assign UV coordinates to front face Poly 0
uv_data[0].uv = (1.0, 0.0) # Loop 0: BR
uv_data[1].uv = (1.0, 1.0) # Loop 1: TR
uv_data[2].uv = (0.0, 1.0) # Loop 2: TL
uv_data[3].uv = (0.0, 0.0) # Loop 3: BL

# All other polys (back, edges) map to solid black margin
for p in mesh.polygons:
    if p.index != 0:
        for li in p.loop_indices:
            uv_data[li].uv = (0.01, 0.01)

# Rebuild clean standard Principled BSDF material
mat = plansza.material_slots[0].material
mat.node_tree.nodes.clear()
out_node = mat.node_tree.nodes.new('ShaderNodeOutputMaterial')
bsdf = mat.node_tree.nodes.new('ShaderNodeBsdfPrincipled')
bsdf.inputs['Roughness'].default_value = 0.55
bsdf.inputs['Metallic'].default_value = 0.35
mat.node_tree.links.new(bsdf.outputs['BSDF'], out_node.inputs['Surface'])

# Load and link plansza_composite.png
tex_img = bpy.data.images.load(tex_composite_path)
tex_img.name = "PlanszaTexture"
tex_node = mat.node_tree.nodes.new('ShaderNodeTexImage')
tex_node.image = tex_img
mat.node_tree.links.new(tex_node.outputs['Color'], bsdf.inputs['Base Color'])
print("1. Fixed PLANSZA.001 material and UVs")

# STEP 3: Create LED Strips parented to PULKA.001
pulka = bpy.data.objects['PULKA.001']

# Material for LEDs (Warm Champagne Gold glow)
led_mat = bpy.data.materials.new(name="LED_Emissive")
led_mat.use_nodes = True
led_nodes = led_mat.node_tree.nodes
led_nodes.clear()
led_out = led_nodes.new('ShaderNodeOutputMaterial')
led_bsdf = led_nodes.new('ShaderNodeBsdfPrincipled')
led_bsdf.inputs['Base Color'].default_value = (1.0, 0.95, 0.88, 1.0)
led_bsdf.inputs['Emission Color'].default_value = (1.0, 0.82, 0.45, 1.0)
led_bsdf.inputs['Emission Strength'].default_value = 6.0
led_bsdf.inputs['Roughness'].default_value = 0.15
led_mat.node_tree.links.new(led_bsdf.outputs['BSDF'], led_out.inputs['Surface'])

def create_led_strip(name, loc_x, loc_y, loc_z, dx=0.009, dy=0.69, dz=0.003):
    m = bpy.data.meshes.new(name + '_Mesh')
    obj = bpy.data.objects.new(name, m)
    bpy.context.collection.objects.link(obj)
    verts = [
        (-dx, -dy, -dz), (dx, -dy, -dz), (dx, dy, -dz), (-dx, dy, -dz),
        (-dx, -dy, dz), (dx, -dy, dz), (dx, dy, dz), (-dx, dy, dz)
    ]
    faces = [
        (0, 1, 2, 3), # bottom face pointing down (-Z)
        (4, 7, 6, 5), # top face
        (0, 4, 5, 1), (2, 6, 7, 3), (1, 5, 6, 2), (3, 7, 4, 0)
    ]
    m.from_pydata(verts, [], faces)
    m.update()
    obj.data.materials.append(led_mat)
    obj.parent = pulka
    obj.location = (loc_x, loc_y, loc_z)
    return obj

# LED_FRONT: under front counter overhang, over PLANSZA.001
led_front = create_led_strip('LED_FRONT', 0.22, 0.0, 0.013)

# LED_BACK: under rear counter overhang, over pulka_duza.001 (bartender table)
led_back = create_led_strip('LED_BACK', 0.0, 0.0, -0.019)
bpy.context.view_layer.update()
print("2. Created LED_FRONT and LED_BACK strips parented to PULKA.001")

# STEP 4: Center BAR_.001 at (0, 0, 0)
bar_root = bpy.data.objects['BAR_.001']
def get_descendants(obj):
    res = [obj]
    for c in obj.children:
        res.extend(get_descendants(c))
    return res

bar_objects = get_descendants(bar_root)
all_pts = []
for o in bar_objects:
    if o.type == 'MESH':
        all_pts.extend([o.matrix_world @ v.co for v in o.data.vertices])

min_x = min(p.x for p in all_pts)
max_x = max(p.x for p in all_pts)
min_y = min(p.y for p in all_pts)
max_y = max(p.y for p in all_pts)
min_z = min(p.z for p in all_pts)

center_x = (min_x + max_x) / 2
center_y = (min_y + max_y) / 2

bar_root.animation_data_clear()
bar_root.location.x -= center_x
bar_root.location.y -= center_y
bar_root.location.z -= min_z
bpy.context.view_layer.update()
print("3. Centered BAR_.001 at (0, 0, 0), floor Z=0")

# STEP 5: Export to GLB
scene.frame_start = 1
scene.frame_end = 75

bpy.ops.object.select_all(action='DESELECT')
for o in bar_objects:
    o.select_set(True)
bpy.context.view_layer.objects.active = bar_root

print(f"4. Exporting to {out_glb}...")
bpy.ops.export_scene.gltf(
    filepath=out_glb,
    export_format='GLB',
    use_selection=True,
    export_apply=False,
    export_animations=True,
    export_animation_mode='ACTIONS',
    export_materials='EXPORT',
    export_cameras=False,
    export_lights=False
)

if os.path.exists(out_glb):
    print(f"SUCCESS: Exported {out_glb} ({os.path.getsize(out_glb)/1024:.1f} KB)")
