# Workflow Editor Style Guide

This document outlines the styling conventions for the workflow editor to ensure a consistent, professional white-background design.

## Background Colors

### Editor Background
- Main background: `#f8fafc` (very light gray)
- Uses `Background` component with `BackgroundVariant.Dots`

### Node Cards
- Default: `bg-white border border-gray-200 shadow-sm`
- When playing/active: `bg-gray-50 outline outline-2 outline-blue-400`
- Node header icon box: `bg-gray-50 border-gray-300`

### Special Elements
- Tips/Info boxes: `bg-blue-50 border border-blue-200`
- Node adder button: `bg-gray-100 hover:bg-gray-200`
- Loop node border: `border-gray-300` (dashed)

## Text Colors

### Primary Text
- Headers and labels: `text-gray-900`
- Normal text: `text-gray-700`
- Secondary/muted text: `text-gray-500`

### Special Text
- Tips/Info text: `text-blue-700`
- Code snippets in tips: `text-blue-900 font-semibold`
- Icon in node adder: `text-gray-600`

## Hover States
- Buttons: `hover:bg-gray-100`
- Node adder: `hover:bg-gray-200`

## Common Patterns

### Node Container
```tsx
<div className={cn(
  "transform-origin-center w-[30rem] space-y-4 rounded-lg bg-white border border-gray-200 px-6 py-4 transition-all shadow-sm",
  {
    "pointer-events-none bg-gray-50 outline outline-2 outline-blue-400": thisBlockIsPlaying,
  },
)}>
```

### Tip/Info Box
```tsx
<div className="rounded-md bg-blue-50 border border-blue-200 p-2">
  <div className="space-y-1 text-xs text-blue-700">
    {/* Tip content */}
  </div>
</div>
```

### Labels
```tsx
<Label className="text-xs font-normal text-gray-700">
  Label Text
</Label>
```

## Migration Checklist

When updating a node component from dark to light theme:

1. ✅ Replace `bg-slate-elevation3` with `bg-white border border-gray-200 shadow-sm`
2. ✅ Replace `bg-slate-950` with `bg-gray-50`
3. ✅ Replace `outline-slate-300` with `outline-blue-400`
4. ✅ Replace `bg-slate-800` (tips) with `bg-blue-50 border border-blue-200`
5. ✅ Replace `text-slate-300/400` with `text-gray-700/500`
6. ✅ Replace `border-slate-600` with `border-gray-300`
7. ✅ Replace `hover:bg-muted` with `hover:bg-gray-100`
8. ✅ Update icon containers to use `bg-gray-50`

## CSS Classes

The main CSS override file (`reactFlowOverrideStyles.css`) has been updated:
- `.react-flow__node-regular`: Now uses white background with border and shadow

## Notes

- All nodes should maintain consistent padding and spacing
- Shadow (`shadow-sm`) provides subtle depth
- Blue accent color is used for active/playing states
- Gray color palette provides professional appearance with good contrast