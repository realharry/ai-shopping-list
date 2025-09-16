# AI Shopping List

A Chrome extension to let you keep track of products you're interested in by allowing you to add them to a local shopping list. By selecting/right-clicking on a product item on a webpage, you can add it to your shopping list. Each item is saved with the page URL/title, product name, price, a link to the product, and your custom memo.

## Features

- **Smart Product Detection**: Uses Chrome's built-in AI (Prompt API) or configurable LLM services to intelligently extract product information from webpages
- **Context Menu Integration**: Right-click on any product, text, image, or link to add items to your shopping list
- **Side Panel Interface**: View, edit, and manage your shopping list in a dedicated side panel
- **Local Storage**: All data is stored locally using Chrome's Storage API - no external servers required
- **Multiple LLM Providers**: Support for Chrome AI, OpenAI, Anthropic Claude, or custom API endpoints
- **Modern UI**: Built with React, TypeScript, Tailwind CSS, and Shadcn UI components
- **Product Information**: Automatically extracts product names, prices, images, and URLs
- **Search & Filter**: Easily find items in your shopping list
- **Edit & Annotate**: Add custom memos and edit product details

## Installation

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/realharry/ai-shopping-list.git
   cd ai-shopping-list
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build:extension
   ```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` folder

### From Pre-built Package

1. Download the `ai-shopping-list-extension.zip` file
2. Extract it to a folder
3. Load the extension in Chrome as described above

## Usage

### Adding Items to Your Shopping List

1. **Context Menu**: Right-click on any product, text, image, or link on a webpage and select "Add to Shopping List"
2. **Manual Addition**: Click the extension icon and use the "Add Item Manually" button in the side panel

### Managing Your Shopping List

1. **View Items**: Click the extension icon to open the popup, then click "Open Shopping List" to view the side panel
2. **Edit Items**: Click the edit button on any item to modify its name, price, or add a memo
3. **Delete Items**: Click the trash button to remove items from your list
4. **Search**: Use the search bar to find specific items

### Configuration

1. Click the extension icon and select "Settings" to open the options page
2. Configure your preferred LLM provider:
   - **Chrome AI**: Uses Chrome's built-in AI capabilities (recommended, no API key required)
   - **OpenAI**: Requires an OpenAI API key
   - **Anthropic**: Requires an Anthropic API key
   - **Custom**: Use your own API endpoint

## Development

### Prerequisites
- Node.js 18+ 
- npm

### Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Create extension package:
   ```bash
   npm run build:extension
   ```

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Shadcn UI components
│   ├── SidePanelApp.tsx
│   ├── PopupApp.tsx
│   ├── OptionsApp.tsx
│   └── ShoppingListView.tsx
├── utils/              # Utility functions
│   └── storage.ts      # Chrome Storage API wrapper
├── background.ts       # Background service worker
├── content.ts          # Content script for webpage interaction
├── types.ts           # TypeScript type definitions
└── *.tsx              # Entry points for different parts of the extension
```

### Technologies Used

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Build Tool**: Vite
- **Chrome APIs**: Storage, Context Menus, Side Panel, Notifications
- **AI Integration**: Chrome Prompt API, OpenAI, Anthropic

## Permissions

The extension requires the following permissions:
- `storage`: To save your shopping list locally
- `contextMenus`: To add the right-click context menu
- `activeTab`: To interact with the current webpage
- `sidePanel`: To display the shopping list interface
- `notifications`: To show confirmation messages
- `aiOriginTrial`: To access Chrome's built-in AI features

## Privacy

All data is stored locally on your device using Chrome's Storage API. No data is sent to external servers unless you configure an external LLM provider (OpenAI, Anthropic, or custom API).

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

If you encounter any issues or have feature requests, please open an issue on GitHub.
