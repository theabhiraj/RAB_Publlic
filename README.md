# RAB's HomeLogo

A React TypeScript web app for designing home layouts with an intuitive drag-and-drop interface.

## Features

- 📐 Custom plot size input (feet/meters)
- 🏠 Drag-and-drop room placement
- 📏 Snap-to-grid alignment
- 🔍 Zoom and pan controls
- 📊 Real-time area calculation
- 💾 Save/load projects (localStorage)
- 🎨 Modern UI with Tailwind CSS
- 📱 **Fully responsive & mobile-friendly**
- 👆 **Touch-optimized for phones & tablets**
- 🔔 **Toast notifications for instant feedback**
- 📚 **Interactive tutorial for first-time users**
- ✨ **Smooth animations & transitions**
- 🎯 **Enhanced floating action buttons**
- 🔌 Offline-friendly
- 📸 Export as PNG or JPG image

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Usage

1. Enter your plot dimensions on the home screen
2. Click "Start Designing" to open the canvas
3. Switch between "Rooms" and "Elements" tabs in the sidebar
4. Add rooms and elements by clicking on them
5. Use the toolbar to switch between tools:
   - **Select/Move**: Default mode for selecting and moving items
   - **Draw Wall**: Click two points to draw walls
   - **Rotate**: Click on elements to rotate them 90°
   - **Erase**: Click on items to delete them
6. Drag items to position them
7. Resize using corner handles
8. Toggle plot border with the border button
9. Projects auto-save to localStorage

## Controls

### Desktop
- **Pan**: Click and drag on empty canvas area (in Select mode)
- **Zoom**: Use zoom buttons in header
- **Select Item**: Click on any room or element
- **Move Item**: Drag selected item (in Select mode)
- **Resize**: Drag corner handles of selected item or use Properties Panel
- **Rotate Element**: Use Rotate tool, Properties Panel, or rotation slider
- **Delete**: Use Erase tool, Properties Panel delete button, or Delete/Backspace key
- **Duplicate**: Click Duplicate button in Properties Panel or press Ctrl+D (Cmd+D on Mac)
- **Edit Properties**: Select item to view/edit in right Properties Panel
- **Export Image**: Click Export button in header, choose PNG or JPG format

### Mobile & Tablet
- **Add Items**: Tap menu icon (☰) to open palette
- **Edit Properties**: Tap settings icon (⚙️) to open properties panel
- **Move Item**: Tap and drag any room or element
- **Resize**: Drag the blue circular handles (larger on mobile)
- **Zoom**: Use floating action buttons (bottom-right)
- **Pan**: Two-finger drag on canvas
- **Select**: Single tap on any item
- **Deselect**: Tap empty canvas area

See [MOBILE_FEATURES.md](MOBILE_FEATURES.md) for detailed mobile usage guide.

## Features

### Rooms
- 10 room types with emoji icons
- Color-coded for easy identification
- Real-time area calculation
- Drag and drop placement
- Resizable with corner handles

### Elements
- **Doors**: Single and double doors
- **Windows**: Standard and large windows
- **Stairs**: Straight and spiral stairs
- **Furniture**: Beds, sofas, tables, chairs, appliances, and more
- All elements can be rotated and resized

### Tools
- **Select/Move**: Navigate and arrange your layout
- **Rotate**: Rotate elements 90° at a time
- **Erase**: Quick delete mode

### Border
- Toggle plot border on/off
- Customizable thickness
- Helps define property boundaries

### Export
- **PNG Format**: High quality, lossless (larger file)
- **JPG Format**: Good quality, smaller file size
- **2x Resolution**: Retina display ready
- **One-Click**: Export button in header
- **Auto-naming**: Files named with timestamp
- **Offline**: All processing in browser

### Properties Panel (Right Side)
- **Room Properties**: Edit name, position, dimensions, color, opacity, and view area
- **Element Properties**: Edit position, dimensions, rotation (0-360°), and opacity
- **Color Picker**: Choose from presets or custom colors for rooms
- **Rotation Slider**: Fine-tune element rotation with 15° increments
- **Opacity Slider**: Adjust transparency from 0% to 100% (5% increments)
- **Quick Presets**: Snap to 0°, 90°, 180°, 270° for rotation; 25%, 50%, 75%, 100% for opacity
- **Duplicate Button**: Create instant copies of rooms or elements
- **Real-time Updates**: Changes apply immediately to canvas
- **Delete Actions**: Remove selected items with one click
