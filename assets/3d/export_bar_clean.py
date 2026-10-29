import bpy
import os
import math
from mathutils import Vector

blend_file = r"d:\PRACA\ARTBAR\artbar anim na strone\animacje na www.blend"
out_dir = r"d:\PRACA\ARTBAR\ARTBAR NEW WEB\assets\3d"
out_glb = os.path.join(out_dir, "bar_animated.glb")

bpy.ops.wm.open_mainfile(filepath=blend_file)
scene = bpy.context.scene

# Set frame to 71 (when the bar is fully assembled)
scene.frame_set(71)
bpy.context.view_layer.update()

bar_root = bpy.data.objects.get("BAR_.001")
if not bar_root:
    print("ERROR: BAR_.001 not found!")
    exit(1)

# Collect all objects belonging to BAR_.001
def get_descendants(obj):
    res = [obj]
    for child in obj.children:
        res.extend(get_descendants(child))
    return res

bar_objects = get_descendants(bar_root)
print(f"Total bar objects: {len(bar_objects)}")

# Calculate world-space bounding box of the assembled bar (frame 71)
all_pts = []
for o in bar_objects:
    if o.type == 'MESH':
        all_pts.extend([o.matrix_world @ v.co for v in o.data.vertices])

min_x = min(p.x for p in all_pts)
max_x = max(p.x for p in all_pts)
min_y = min(p.y for p in all_pts)
max_y = max(p.y for p in all_pts)
min_z = min(p.z for p in all_pts)
max_z = max(p.z for p in all_pts)

center_x = (min_x + max_x) / 2
center_y = (min_y + max_y) / 2
print(f"Original Bounds: X=[{min_x:.3f}, {max_x:.3f}], Y=[{min_y:.3f}, {max_y:.3f}], Z=[{min_z:.3f}, {max_z:.3f}]")
print(f"Center: X={center_x:.3f}, Y={center_y:.3f}, Floor Z={min_z:.3f}")

# Remove any empty animation data on root null so it stays fixed
bar_root.animation_data_clear()

# Offset bar_root so the assembled bar is centered at (0, 0, 0) and rests on floor Z=0
bar_root.location.x -= center_x
bar_root.location.y -= center_y
bar_root.location.z -= min_z
bpy.context.view_layer.update()

# Verify new bounds
pts_new = []
for o in bar_objects:
    if o.type == 'MESH':
        pts_new.extend([o.matrix_world @ v.co for v in o.data.vertices])

print("Centered Bounds:")
print(f"  X: [{min(p.x for p in pts_new):.3f}, {max(p.x for p in pts_new):.3f}]")
print(f"  Y: [{min(p.y for p in pts_new):.3f}, {max(p.y for p in pts_new):.3f}]")
print(f"  Z: [{min(p.z for p in pts_new):.3f}, {max(p.z for p in pts_new):.3f}]")

# Frame range 1 to 75
scene.frame_start = 1
scene.frame_end = 75

# Select ONLY bar objects
bpy.ops.object.select_all(action='DESELECT')
for o in bar_objects:
    o.select_set(True)
bpy.context.view_layer.objects.active = bar_root

print(f"Exporting centered GLB to {out_glb}...")
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
    print(f"SUCCESS: Exported {os.path.getsize(out_glb) / 1024:.1f} KB")
