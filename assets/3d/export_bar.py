import bpy
import os

blend_file = r"d:\PRACA\ARTBAR\artbar anim na strone\animacje na www.blend"
out_dir = r"d:\PRACA\ARTBAR\ARTBAR NEW WEB\assets\3d"
os.makedirs(out_dir, exist_ok=True)
out_glb = os.path.join(out_dir, "bar_animated.glb")

bpy.ops.wm.open_mainfile(filepath=blend_file)

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
print(f"Found {len(bar_objects)} objects in BAR_.001 hierarchy:")
for o in bar_objects:
    print(f"  - {o.name} (type: {o.type})")

# Set frame range of the scene to the animation of the bar: 1 to 75
bpy.context.scene.frame_start = 1
bpy.context.scene.frame_end = 75

# Select only bar objects
bpy.ops.object.select_all(action='DESELECT')
for o in bar_objects:
    o.select_set(True)
bpy.context.view_layer.objects.active = bar_root

print(f"Exporting to {out_glb}...")

# Export glTF / GLB
bpy.ops.export_scene.gltf(
    filepath=out_glb,
    export_format='GLB',
    use_selection=True,
    export_apply=False,
    export_animations=True,
    export_animation_mode='ACTIONS', # or 'SCENE'
    export_materials='EXPORT',
    export_cameras=False,
    export_lights=False
)

if os.path.exists(out_glb):
    size_kb = os.path.getsize(out_glb) / 1024
    print(f"SUCCESS: Exported {out_glb} ({size_kb:.1f} KB)")
else:
    print("ERROR: GLB file was not created!")
