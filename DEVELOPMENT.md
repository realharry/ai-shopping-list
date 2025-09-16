# Development Guide

## Architecture Overview

The AI Shopping List extension consists of several key components:

### 1. Background Script (`src/background.ts`)
- Service worker that manages the extension lifecycle
- Handles context menu creation and clicks
- Coordinates between content scripts and UI components
- Manages notifications and storage events

### 2. Content Script (`src/content.ts`)
- Injected into web pages to interact with DOM
- Extracts product information using AI or fallback methods
- Provides visual feedback when products are selected
- Communicates with background script

### 3. UI Components
- **Popup** (`src/components/PopupApp.tsx`): Quick access interface
- **Side Panel** (`src/components/SidePanelApp.tsx`): Main shopping list interface
- **Options** (`src/components/OptionsApp.tsx`): Configuration settings

### 4. Storage Layer (`src/utils/storage.ts`)
- Wraps Chrome Storage API for type safety
- Manages shopping list items and extension settings
- Provides consistent interface for all storage operations

## Product Scraping Strategy

The extension uses a multi-layered approach to extract product information:

1. **Chrome AI (Prompt API)**: Primary method using Chrome's built-in AI
2. **Fallback Scraping**: Manual DOM parsing with common selectors
3. **Context Awareness**: Uses click context (selection, images, links)

### AI Integration

```typescript
// Chrome AI integration
if (settings.llmConfig.provider === 'chrome-ai' && 'ai' in window) {
  const session = await (window as any).ai.languageModel.create({
    systemPrompt: `Extract product information from this webpage...`
  });
  const response = await session.prompt(htmlContext);
}
```

### Fallback Selectors

Common patterns for product information:
- Product names: `h1[class*="product"]`, `[data-testid*="product-name"]`
- Prices: `[class*="price"]`, `[data-testid*="price"]`
- Images: `[class*="product"] img`, `main img`

## UI Architecture

### Component Hierarchy
```
PopupApp
├── Quick stats and navigation
└── Recent items list

SidePanelApp
├── Search and filter
├── Add item button
└── ShoppingListView
    └── Individual item cards with edit/delete actions

OptionsApp
├── LLM provider configuration
├── API key management
└── Extension settings
```

### State Management
- Local component state using React hooks
- Chrome Storage API for persistence
- Event-driven synchronization across components

## Storage Schema

### Shopping List Item
```typescript
interface ShoppingListItem {
  id: string;                // Unique identifier
  productName: string;       // Product title
  price?: string;            // Extracted price
  url: string;               // Product URL
  pageTitle: string;         // Source page title
  pageUrl: string;           // Source page URL
  imageUrl?: string;         // Product image
  memo?: string;             // User notes
  dateAdded: string;         // ISO timestamp
  selector?: string;         // CSS selector (for debugging)
}
```

### Extension Settings
```typescript
interface ExtensionSettings {
  llmConfig: LLMConfig;      // AI provider configuration
  autoScrapeEnabled: boolean; // Auto-extraction toggle
}
```

## Build Process

### Vite Configuration
- Multi-entry build for different extension parts
- Custom output naming for background/content scripts
- Asset optimization and bundling

### PostCSS Setup
- Tailwind CSS processing
- Autoprefixer for browser compatibility
- CSS optimization for production

## Chrome Extension APIs Used

### Required Permissions
- `storage`: Local data persistence
- `contextMenus`: Right-click integration
- `activeTab`: Current page access
- `sidePanel`: UI panel display
- `notifications`: User feedback
- `aiOriginTrial`: Chrome AI access

### Manifest V3 Features
- Service worker background script
- Declarative content scripts
- Side panel API integration

## Testing Strategy

### Manual Testing Checklist
1. Install extension in Chrome
2. Test context menu on various websites
3. Verify product information extraction
4. Test side panel functionality
5. Validate options page settings
6. Check storage persistence

### Common Issues
- Chrome AI availability varies by Chrome version
- Side panel API requires Chrome 114+
- Some websites block content script injection

## Debugging Tips

### Chrome DevTools
- Background script: `chrome://extensions/` → Inspect views
- Content script: Regular page DevTools
- Popup/Options: Right-click → Inspect

### Logging
- Background script logs appear in service worker console
- Content script logs appear in page console
- Use `chrome.storage.local.get()` to inspect stored data

## Deployment

### Extension Package
```bash
npm run build:extension  # Creates ai-shopping-list-extension.zip
```

### Chrome Web Store
1. Build production package
2. Create developer account
3. Upload ZIP file
4. Fill out store listing
5. Submit for review

## Future Enhancements

### Planned Features
- Bulk operations (select multiple items)
- Export/import functionality
- Price tracking and alerts
- Category/tag system
- Shared shopping lists

### Technical Improvements
- Service worker optimization
- Better error handling
- Accessibility improvements
- Performance monitoring