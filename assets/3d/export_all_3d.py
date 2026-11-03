import bpy
import bmesh
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

regal_root = bpy.data.objects['REGAL NULL']
r1 = bpy.data.objects['REGAL.001']
r3 = bpy.data.objects['REGAL.003']

# -------------------------------------------------------------
# Shared Materials for Regał Back Panels
# -------------------------------------------------------------
# Material: 3 logos (top, middle, bottom) -> front facing into shelves
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

# Material: 1 logo (middle) -> back facing exterior
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

# -------------------------------------------------------------
# Part A: REGAL_TYL_DOL (Bottom stationary board, od dołu do blatu: Y: 0.100906 do 0.900000)
# Permanent back panel, does not slide - stationary throughout all frames
# -------------------------------------------------------------
print("=== CONFIGURE REGAL_TYL_DOL (BOTTOM STATIONARY BOARD) ===")
obj_bot = bpy.data.objects.get("REGAL_TYL_DOL")
if not obj_bot:
    mesh_bot = bpy.data.meshes.new("REGAL_TYL_DOL_Mesh")
    obj_bot = bpy.data.objects.new("REGAL_TYL_DOL", mesh_bot)
    bpy.context.collection.objects.link(obj_bot)
else:
    mesh_bot = obj_bot.data

obj_bot.parent = regal_root
obj_bot.matrix_parent_inverse = r1.matrix_parent_inverse.copy()
obj_bot.location = r1.location.copy()
obj_bot.rotation_euler = r1.rotation_euler.copy()
obj_bot.scale = r1.scale.copy()
obj_bot.animation_data_clear()

bm_b = bmesh.new()
# Front verts (X = -0.025)
v_bf_TL = bm_b.verts.new((-0.025, 0.900000, -0.750))
v_bf_BL = bm_b.verts.new((-0.025, 0.100906, -0.750))
v_bf_BR = bm_b.verts.new((-0.025, 0.100906,  0.750))
v_bf_TR = bm_b.verts.new((-0.025, 0.900000,  0.750))
# Back verts (X = -0.035)
v_bb_TL = bm_b.verts.new((-0.035, 0.900000, -0.750))
v_bb_BL = bm_b.verts.new((-0.035, 0.100906, -0.750))
v_bb_BR = bm_b.verts.new((-0.035, 0.100906,  0.750))
v_bb_TR = bm_b.verts.new((-0.035, 0.900000,  0.750))

# Faces with outward normals
bm_b.faces.new([v_bf_TL, v_bf_TR, v_bf_BR, v_bf_BL]) # Front (+X)
bm_b.faces.new([v_bb_TR, v_bb_TL, v_bb_BL, v_bb_BR]) # Back (-X)
bm_b.faces.new([v_bf_BL, v_bb_BL, v_bb_BR, v_bf_BR]) # Bottom (-Y)
bm_b.faces.new([v_bf_TR, v_bb_TR, v_bb_TL, v_bf_TL]) # Top (+Y)
bm_b.faces.new([v_bf_TL, v_bb_TL, v_bb_BL, v_bf_BL]) # Left (-Z)
bm_b.faces.new([v_bf_BR, v_bb_BR, v_bb_TR, v_bf_TR]) # Right (+Z)

mesh_bot.clear_geometry()
bm_b.to_mesh(mesh_bot)
bm_b.free()
mesh_bot.update()

obj_bot.data.materials.clear()
obj_bot.data.materials.append(black_mat)  # Slot 0
obj_bot.data.materials.append(mat_3logos) # Slot 1
obj_bot.data.materials.append(mat_1logo)  # Slot 2

while len(mesh_bot.uv_layers) > 0:
    mesh_bot.uv_layers.remove(mesh_bot.uv_layers[0])
uv_layer_bot = mesh_bot.uv_layers.new(name='UVMap')
uv_data_bot = uv_layer_bot.data

for p in mesh_bot.polygons:
    norm = p.normal
    if norm.x > 0.5:
        p.material_index = 1 # 3 logos front
        for li in p.loop_indices:
            v = mesh_bot.vertices[mesh_bot.loops[li].vertex_index]
            u = (0.75 - v.co.z) / 1.50
            v_coord = (v.co.y - 0.101) / 2.159
            uv_data_bot[li].uv = (u, v_coord)
    elif norm.x < -0.5:
        p.material_index = 2 # 1 logo back
        for li in p.loop_indices:
            v = mesh_bot.vertices[mesh_bot.loops[li].vertex_index]
            u = (v.co.z + 0.75) / 1.50
            v_coord = (v.co.y - 0.101) / 2.159
            uv_data_bot[li].uv = (u, v_coord)
    else:
        p.material_index = 0 # black edges
        for li in p.loop_indices:
            uv_data_bot[li].uv = (0.01, 0.01)

print("REGAL_TYL_DOL configured.")

# -------------------------------------------------------------
# Part B: REGAL.003 (Upper sliding board, za półkami od blatu: Y: 0.900000 do 2.260000)
# Retains REGAL.003Action to slide in from above between frames 59 and 80
# -------------------------------------------------------------
print("=== CONFIGURE REGAL.003 (UPPER SLIDING BOARD) ===")
bm_t = bmesh.new()
y_levels = [0.900000, 1.352346, 1.816245, 2.260000]
front_verts = []
back_verts = []

for y in y_levels:
    vf_L = bm_t.verts.new((-0.025, y, -0.750))
    vf_R = bm_t.verts.new((-0.025, y,  0.750))
    vb_L = bm_t.verts.new((-0.035, y, -0.750))
    vb_R = bm_t.verts.new((-0.035, y,  0.750))
    front_verts.append((vf_L, vf_R))
    back_verts.append((vb_L, vb_R))

for i in range(3):
    vf_b_L, vf_b_R = front_verts[i]
    vf_t_L, vf_t_R = front_verts[i+1]
    vb_b_L, vb_b_R = back_verts[i]
    vb_t_L, vb_t_R = back_verts[i+1]
    
    # Front face (+X)
    bm_t.faces.new([vf_t_L, vf_t_R, vf_b_R, vf_b_L])
    # Back face (-X)
    bm_t.faces.new([vb_t_R, vb_t_L, vb_b_L, vb_b_R])
    # Left face (-Z)
    bm_t.faces.new([vf_t_L, vb_t_L, vb_b_L, vf_b_L])
    # Right face (+Z)
    bm_t.faces.new([vf_b_R, vb_b_R, vb_t_R, vf_t_R])

# Bottom face (-Y, lands on blat at 0.900)
bm_t.faces.new([front_verts[0][0], back_verts[0][0], back_verts[0][1], front_verts[0][1]])
# Top face (+Y, flush with top frame at 2.260)
bm_t.faces.new([front_verts[3][1], back_verts[3][1], back_verts[3][0], front_verts[3][0]])

mesh_top = bpy.data.meshes.new("REGAL_003_Top_Mesh")
bm_t.to_mesh(mesh_top)
bm_t.free()
mesh_top.update()

# Assign new mesh data to r3 (retaining its original animation action REGAL.003Action)
r3.data = mesh_top

r3.data.materials.clear()
r3.data.materials.append(black_mat)  # Slot 0
r3.data.materials.append(mat_3logos) # Slot 1
r3.data.materials.append(mat_1logo)  # Slot 2

while len(mesh_top.uv_layers) > 0:
    mesh_top.uv_layers.remove(mesh_top.uv_layers[0])
uv_layer_top = mesh_top.uv_layers.new(name='UVMap')
uv_data_top = uv_layer_top.data

for p in mesh_top.polygons:
    norm = p.normal
    if norm.x > 0.5:
        p.material_index = 1 # 3 logos front
        for li in p.loop_indices:
            v = mesh_top.vertices[mesh_top.loops[li].vertex_index]
            u = (0.75 - v.co.z) / 1.50
            v_coord = (v.co.y - 0.101) / 2.159
            uv_data_top[li].uv = (u, v_coord)
    elif norm.x < -0.5:
        p.material_index = 2 # 1 logo back
        for li in p.loop_indices:
            v = mesh_top.vertices[mesh_top.loops[li].vertex_index]
            u = (v.co.z + 0.75) / 1.50
            v_coord = (v.co.y - 0.101) / 2.159
            uv_data_top[li].uv = (u, v_coord)
    else:
        p.material_index = 0 # black edges
        for li in p.loop_indices:
            uv_data_top[li].uv = (0.01, 0.01)

print("REGAL.003 configured.")

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

# Save updated state to blend file
print(f"Saving updated scene to {blend_file}...")
bpy.ops.wm.save_mainfile(filepath=blend_file)
print("ALL EXPORTS AND SAVE COMPLETE!")
