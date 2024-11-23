# Inventory Management System

This is a React-based **Inventory Management System** designed with Tailwind CSS for styling. The system provides a modular and customizable layout that allows users to manage inventory items, equip character items, and interact with quick access slots and ground items. It also includes features such as drag-and-drop interactions, theme customization, and layout settings.

---

## Features

### 1. **Character Equipment Panel**
- Manage character-specific equipment like hats, armor, and shoes.
- Equip or unequip items directly into predefined equipment slots.

### 2. **Main Inventory**
- Store and organize items in a flexible grid layout.
- Drag and drop items within inventory or to other sections.
- Shows item weights and allows for quantity management.

### 3. **Ground Items Panel**
- Display items available on the ground in a scrollable section.
- Pick up items and add them to the inventory.

### 4. **Quick Slots Panel**
- Dedicated quick access slots for frequently used items.
- Supports drag-and-drop and item reordering.
- Selected quick slots can be highlighted for active use.

### 5. **Settings Modal**
- Access and modify layout configurations.
- Customize theme colors for a personalized experience.

### 6. **Drag and Drop**
- Seamless item dragging with a live preview of the dragged item.
- Drop items into valid slots or the ground.

### 7. **Item Action Menu**
- Contextual menu for item-specific actions.
- Adjust inventory or quick slots via this menu.

---

## File Structure

### Components

- **EquipmentSlot**: Represents character equipment slots (e.g., hat, armor).
- **InventoryItem**: Renders items in the inventory grid.
- **EmptySlot**: Placeholder for empty inventory slots.
- **QuickSlot**: Displays items in the quick access slots.
- **GroundItems**: Handles items that are present on the ground.
- **InventoryWeight**: Displays the current weight of the inventory.
- **EnhancedSettingsModal**: Modal for theme and layout configuration.
- **ItemMenu**: Contextual menu for item-related actions.
- **DragPreview**: Live preview while dragging items.

---

## Getting Started

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16+)
- **npm** or **yarn**
- A modern browser for testing

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd inventory-management-system
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
Start the development server:
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

---

## Usage

1. **Interacting with Items**
   - Drag and drop items to different sections (inventory, equipment slots, ground, or quick slots).
   - Click on items to open the **Item Action Menu** for additional options.

2. **Modifying Settings**
   - Click the **Settings Button** to open the modal.
   - Change themes or layouts dynamically.

3. **Quick Slots Management**
   - Drag frequently used items into quick slots.
   - Select quick slots for active use.

---

## Customization

### Theming
- Modify the `activeTheme` object for custom colors.
- Themes can be changed dynamically through the **Settings Modal**.

### Layout
- Predefined layouts are stored in the `currentLayout` object.
- Update the `activeLayout` state to apply a new layout configuration.

---

## Technologies Used

- **React**: Frontend framework for building components.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Heroicons**: Icons for UI elements.
- **Custom Drag-and-Drop**: Implemented for item management.

---

## Future Enhancements

- Add **search functionality** to filter inventory items.
- Include **weight limit logic** to prevent overloading.
- Provide **multi-language support** for better accessibility.

---

## Contributions
Feel free to contribute by submitting a pull request or opening an issue.

---

## License
This project is open-source under the [MIT License](LICENSE).

---

### Contact
For inquiries or support, please reach out to the repository owner.

