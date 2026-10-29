import bpy
import os

out_dir = r"d:\PRACA\ARTBAR\ARTBAR NEW WEB\assets\3d"
blend_file = r"d:\PRACA\ARTBAR\artbar anim na strone\animacje na www.blend"

plansza_tex_path = os.path.join(out_dir, "plansza_composite.png")
regal_front_tex_path = os.path.join(out_dir, "regal_front_logo.png")
regal_back_tex_path = os.path.join(out_dir, "regal_back_3logos.png")

out_bar_glb = os.path.join(out_dir, "bar_animated.glb")
out_regal_glb = os.path.join(out_dir, "regal_animated.glb")

print("=== STEP 1: OPEN MAIN BLENDER FILE ===")
bpy.ops.wm.open_mainfile(filepath=blend_file)
scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end = 80
scene.frame_set(80)
bpy.context.view_layer.update()

# -------------------------------------------------------------
# STEP 2: FIX PLANSZA.001 (BAR GUEST LOGO)
# -------------------------------------------------------------
print("=== STEP 2: FIX PLANSZA.001 ===")
plansza = bpy.data.objects['PLANSZA.001']
mesh_p = plansza.data

while len(mesh_p.uv_layers) > 1:
    mesh_p.uv_layers.remove(mesh_p.uv_layers[1])
uv_p = mesh_p.uv_layers[0]
uv_p.name = 'UVMap'
uv_data_p = uv_p.data

# Front face Poly 0
uv_data_p[0].uv = (1.0, 0.0) # Loop 0: BR
uv_data_p[1].uv = (1.0, 1.0) # Loop 1: TR
uv_data_p[2].uv = (0.0, 1.0) # Loop 2: TL
uv_data_p[3].uv = (0.0, 0.0) # Loop 3: BL

for p in mesh_p.polygons:
    if p.index != 0:
        for li in p.loop_indices:
            uv_data_p[li].uv = (0.01, 0.01)

mat_p = plansza.material_slots[0].material
mat_p.node_tree.nodes.clear()
out_node_p = mat_p.node_tree.nodes.new('ShaderNodeOutputMaterial')
bsdf_p = mat_p.node_tree.nodes.new('ShaderNodeBsdfPrincipled')
bsdf_p.inputs['Roughness'].default_value = 0.55
bsdf_p.inputs['Metallic'].default_value = 0.35
mat_p.node_tree.links.new(bsdf_p.outputs['BSDF'], out_node_p.inputs['Surface'])

tex_img_p = bpy.data.images.load(plansza_tex_path)
tex_img_p.name = "PlanszaTexture"
tex_node_p = mat_p.node_tree.nodes.new('ShaderNodeTexImage')
tex_node_p.image = tex_img_p
mat_p.node_tree.links.new(tex_node_p.outputs['Color'], bsdf_p.inputs['Base Color'])
print("PLANSZA.001 configured.")

# -------------------------------------------------------------
# STEP 3: CREATE / VERIFY BAR LED STRIPS
# -------------------------------------------------------------
print("=== STEP 3: CONFIGURE BAR LED STRIPS ===")
pulka = bpy.data.objects['PULKA.001']

led_mat = bpy.data.materials.new(name="LED_Emissive")
led_mat.use_nodes = True
led_nodes = led_mat.node_tree.nodes
led_nodes.clear()
led_out = led_nodes.new('ShaderNodeOutputMaterial')
led_bsdf = led_nodes.new('ShaderNodeBsdfPrincipled')
led_bsdf.inputs['Base Color'].default_value = (0.12, 0.12, 0.12, 1.0)
led_bsdf.inputs['Emission Color'].default_value = (1.0, 0.82, 0.45, 1.0)
led_bsdf.inputs['Emission Strength'].default_value = 8.0
led_bsdf.inputs['Roughness'].default_value = 0.15
led_mat.node_tree.links.new(led_bsdf.outputs['BSDF'], led_out.inputs['Surface'])

def create_or_get_led(name, parent_obj, loc_x, loc_y, loc_z, dx=0.004, dy=0.69, dz=0.007):
    obj = bpy.data.objects.get(name)
    if not obj:
        m = bpy.data.meshes.new(name + '_Mesh')
        obj = bpy.data.objects.new(name, m)
        bpy.context.collection.objects.link(obj)
        verts = [
            (-dx, -dy, -dz), (dx, -dy, -dz), (dx, dy, -dz), (-dx, dy, -dz),
            (-dx, -dy, dz), (dx, -dy, dz), (dx, dy, dz), (-dx, dy, dz)
        ]
        faces = [
            (0, 1, 2, 3), (4, 7, 6, 5),
            (0, 4, 5, 1), (2, 6, 7, 3), (1, 5, 6, 2), (3, 7, 4, 0)
        ]
        m.from_pydata(verts, [], faces)
        m.update()
        obj.data.materials.append(led_mat)
    else:
        obj.data.materials.clear()
        obj.data.materials.append(led_mat)
    obj.parent = parent_obj
    obj.location = (loc_x, loc_y, loc_z)
    return obj

# Bar front LED strip - under the front overhang of PULKA.001 (pod spodem blatu baru)
led_front = create_or_get_led('LED_FRONT', pulka, 0.280, 0.0, 0.012, dx=0.008, dy=0.70, dz=0.003)
# Bar back LED strip - under bartender shelf
led_back = create_or_get_led('LED_BACK', pulka, 0.0, 0.0, -0.019, dx=0.009, dy=0.69, dz=0.003)
bpy.context.view_layer.update()
print("Bar LED strips attached.")

# -------------------------------------------------------------
# STEP 4: CENTER BAR_.001 AND EXPORT BAR GLB
# -------------------------------------------------------------
print("=== STEP 4: EXPORT BAR GLB ===")
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

bpy.ops.object.select_all(action='DESELECT')
for o in bar_objects:
    o.select_set(True)
bpy.context.view_layer.objects.active = bar_root

print(f"Exporting {out_bar_glb}...")
bpy.ops.export_scene.gltf(
    filepath=out_bar_glb,
    export_format='GLB',
    use_selection=True,
    export_apply=False,
    export_animations=True,
    export_animation_mode='ACTIONS',
    export_materials='EXPORT',
    export_cameras=False,
    export_lights=False
)
print(f"Bar exported: {os.path.exists(out_bar_glb)} ({os.path.getsize(out_bar_glb)/1024:.1f} KB)")

# -------------------------------------------------------------
# STEP 5: RE-OPEN FILE FOR CLEAN REGAŁ EXPORT
# -------------------------------------------------------------
print("=== STEP 5: RE-OPEN BLENDER FILE FOR REGAŁ ===")
bpy.ops.wm.open_mainfile(filepath=blend_file)
scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end = 80
scene.frame_set(80)
bpy.context.view_layer.update()

# Configure REGAL.003 (Sliding Board)
r3 = bpy.data.objects['REGAL.003']
mesh_r3 = r3.data

while len(mesh_r3.uv_layers) > 1:
    mesh_r3.uv_layers.remove(mesh_r3.uv_layers[1])
uv_r3 = mesh_r3.uv_layers[0]
uv_r3.name = 'UVMap'
uv_data_r3 = uv_r3.data

front_polys = [0, 10, 6] # normal (+1, 0, 0) facing shelves / wnęka
back_polys = [5, 12, 9]  # normal (-1, 0, 0) facing exterior back wall

# Front UVs: looking from +X into wnęka: Left is +Z, Right is -Z
for p_idx in front_polys:
    p = mesh_r3.polygons[p_idx]
    for li in p.loop_indices:
        v = mesh_r3.vertices[mesh_r3.loops[li].vertex_index]
        u = (0.75 - v.co.z) / 1.50
        v_coord = (v.co.y - 0.101) / 2.159
        uv_data_r3[li].uv = (u, v_coord)

# Back UVs: looking from -X at back wall: Left is -Z, Right is +Z
for p_idx in back_polys:
    p = mesh_r3.polygons[p_idx]
    for li in p.loop_indices:
        v = mesh_r3.vertices[mesh_r3.loops[li].vertex_index]
        u = (v.co.z + 0.75) / 1.50
        v_coord = (v.co.y - 0.101) / 2.159
        uv_data_r3[li].uv = (u, v_coord)

# Edge polys map to solid black corner
for p in mesh_r3.polygons:
    if p.index not in front_polys and p.index not in back_polys:
        for li in p.loop_indices:
            uv_data_r3[li].uv = (0.01, 0.01)

# Material: 3 logos (top, middle, bottom) -> now on front_polys (inside wnęka / shelves)
mat_3logos = bpy.data.materials.new('REGAL_3LOGOS')
mat_3logos.use_nodes = True
nodes_3 = mat_3logos.node_tree.nodes
nodes_3.clear()
out_3 = nodes_3.new('ShaderNodeOutputMaterial')
bsdf_3 = nodes_3.new('ShaderNodeBsdfPrincipled')
bsdf_3.inputs['Roughness'].default_value = 0.55
bsdf_3.inputs['Metallic'].default_value = 0.05
tex_3 = nodes_3.new('ShaderNodeTexImage')
tex_3.image = bpy.data.images.load(regal_back_tex_path)
mat_3logos.node_tree.links.new(tex_3.outputs['Color'], bsdf_3.inputs['Base Color'])
mat_3logos.node_tree.links.new(bsdf_3.outputs['BSDF'], out_3.inputs['Surface'])

# Material: 1 logo (middle) -> now on back_polys (exterior back wall)
mat_1logo = bpy.data.materials.new('REGAL_1LOGO')
mat_1logo.use_nodes = True
nodes_1 = mat_1logo.node_tree.nodes
nodes_1.clear()
out_1 = nodes_1.new('ShaderNodeOutputMaterial')
bsdf_1 = nodes_1.new('ShaderNodeBsdfPrincipled')
bsdf_1.inputs['Roughness'].default_value = 0.55
bsdf_1.inputs['Metallic'].default_value = 0.05
tex_1 = nodes_1.new('ShaderNodeTexImage')
tex_1.image = bpy.data.images.load(regal_front_tex_path)
mat_1logo.node_tree.links.new(tex_1.outputs['Color'], bsdf_1.inputs['Base Color'])
mat_1logo.node_tree.links.new(bsdf_1.outputs['BSDF'], out_1.inputs['Surface'])

# Black base paint for edges
black_mat = bpy.data.materials.get('Matal solid paint black.002')
if not black_mat:
    black_mat = bpy.data.materials.new('REGAL_BLACK')
    black_mat.use_nodes = True
    black_mat.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (0.02, 0.02, 0.02, 1.0)

r3.data.materials.clear()
r3.data.materials.append(black_mat)  # Slot 0: edges
r3.data.materials.append(mat_3logos) # Slot 1: front (3 logos)
r3.data.materials.append(mat_1logo)  # Slot 2: back (1 logo)

for p in mesh_r3.polygons:
    if p.index in front_polys:
        p.material_index = 1 # 3 logos
    elif p.index in back_polys:
        p.material_index = 2 # 1 logo
    else:
        p.material_index = 0

print("REGAL.003 materials and UVs configured.")

# -------------------------------------------------------------
# Shelf LED strips on Regał
# -------------------------------------------------------------
regal_led_mat = bpy.data.materials.new(name="REGAL_LED_MAT")
regal_led_mat.use_nodes = True
r_nodes = regal_led_mat.node_tree.nodes
r_nodes.clear()
r_out = r_nodes.new('ShaderNodeOutputMaterial')
r_bsdf = r_nodes.new('ShaderNodeBsdfPrincipled')
r_bsdf.inputs['Base Color'].default_value = (0.12, 0.12, 0.12, 1.0)
r_bsdf.inputs['Emission Color'].default_value = (1.0, 0.82, 0.45, 1.0)
r_bsdf.inputs['Emission Strength'].default_value = 8.0
r_bsdf.inputs['Roughness'].default_value = 0.15
regal_led_mat.node_tree.links.new(r_bsdf.outputs['BSDF'], r_out.inputs['Surface'])

polka_dolna = bpy.data.objects.get('polka dolna.002')
polka_gorna = bpy.data.objects.get('polka gorna.003')

# Restore black plastic material on both shelves (slot 0 for dolna, slot 3 for gorna)
if polka_dolna:
    for p in polka_dolna.data.polygons:
        p.material_index = 0
if polka_gorna:
    for p in polka_gorna.data.polygons:
        p.material_index = 3

def create_regal_led(name, parent_obj, loc_x, loc_y, loc_z, dx=0.010, dy=0.0025, dz=0.68):
    obj = bpy.data.objects.get(name)
    if not obj:
        m = bpy.data.meshes.new(name + '_Mesh')
        obj = bpy.data.objects.new(name, m)
        bpy.context.collection.objects.link(obj)
        verts = [
            (-dx, -dy, -dz), (dx, -dy, -dz), (dx, dy, -dz), (-dx, dy, -dz),
            (-dx, -dy, dz), (dx, -dy, dz), (dx, dy, dz), (-dx, dy, dz)
        ]
        faces = [
            (0, 1, 2, 3), (4, 7, 6, 5),
            (0, 4, 5, 1), (2, 6, 7, 3), (1, 5, 6, 2), (3, 7, 4, 0)
        ]
        m.from_pydata(verts, [], faces)
        m.update()
        obj.data.materials.append(regal_led_mat)
    else:
        obj.data.materials.clear()
        obj.data.materials.append(regal_led_mat)
    obj.parent = parent_obj
    obj.location = (loc_x, loc_y, loc_z)
    return obj

# Dolna półka - spód (pod spodem) i góra (na wierzchu)
if polka_dolna:
    create_regal_led('REGAL_LED_DOL_DOL', polka_dolna, 0.320, -0.034, 0.0, dx=0.010, dy=0.0025, dz=0.68)
    create_regal_led('REGAL_LED_DOL_GORA', polka_dolna, 0.320, 0.001, 0.0, dx=0.010, dy=0.0025, dz=0.68)

# Górna półka - spód (pod spodem) i góra (na wierzchu)
if polka_gorna:
    create_regal_led('REGAL_LED_GORA_DOL', polka_gorna, 0.320, -0.034, 0.0, dx=0.010, dy=0.0025, dz=0.68)
    create_regal_led('REGAL_LED_GORA_GORA', polka_gorna, 0.320, 0.001, 0.0, dx=0.010, dy=0.0025, dz=0.68)

bpy.context.view_layer.update()
print("Regał LED strips attached on both shelves (top and bottom faces).")

# Center REGAL NULL at (0, 0, 0)
regal_root = bpy.data.objects['REGAL NULL']
regal_objects = get_descendants(regal_root)

reg_pts = []
for o in regal_objects:
    if o.type == 'MESH':
        reg_pts.extend([o.matrix_world @ v.co for v in o.data.vertices])

min_rx = min(p.x for p in reg_pts)
max_rx = max(p.x for p in reg_pts)
min_ry = min(p.y for p in reg_pts)
max_ry = max(p.y for p in reg_pts)
min_rz = min(p.z for p in reg_pts)

center_rx = (min_rx + max_rx) / 2
center_ry = (min_ry + max_ry) / 2

regal_root.animation_data_clear()
regal_root.location.x -= center_rx
regal_root.location.y -= center_ry
regal_root.location.z -= min_rz
bpy.context.view_layer.update()

# Export regal
bpy.ops.object.select_all(action='DESELECT')
for o in regal_objects:
    o.select_set(True)
bpy.context.view_layer.objects.active = regal_root

print(f"Exporting {out_regal_glb}...")
bpy.ops.export_scene.gltf(
    filepath=out_regal_glb,
    export_format='GLB',
    use_selection=True,
    export_apply=False,
    export_animations=True,
    export_animation_mode='ACTIONS',
    export_materials='EXPORT',
    export_cameras=False,
    export_lights=False
)
print(f"Regał exported: {os.path.exists(out_regal_glb)} ({os.path.getsize(out_regal_glb)/1024:.1f} KB)")
print("ALL EXPORTS COMPLETE!")
