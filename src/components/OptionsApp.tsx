import { useState, useEffect } from 'react';
import type { ExtensionSettings, LLMConfig } from '../types';
import { StorageManager } from '../utils/storage';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { SaveIcon, ShoppingCartIcon } from 'lucide-react';

export function OptionsApp() {
  const [settings, setSettings] = useState<ExtensionSettings>({
    llmConfig: {
      provider: 'chrome-ai',
    },
    autoScrapeEnabled: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const currentSettings = await StorageManager.getSettings();
      setSettings(currentSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await StorageManager.saveSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateLLMConfig = (updates: Partial<LLMConfig>) => {
    setSettings(prev => ({
      ...prev,
      llmConfig: { ...prev.llmConfig, ...updates },
    }));
  };

  const providers = [
    { value: 'chrome-ai' as const, label: 'Chrome Built-in AI (Prompt API)', description: 'Uses Chrome\'s built-in AI capabilities' },
    { value: 'openai' as const, label: 'OpenAI', description: 'Requires OpenAI API key' },
    { value: 'anthropic' as const, label: 'Anthropic Claude', description: 'Requires Anthropic API key' },
    { value: 'custom' as const, label: 'Custom API', description: 'Use your own API endpoint' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <ShoppingCartIcon className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Shopping List</h1>
          <p className="text-muted-foreground">Configure your extension settings</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>LLM Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">AI Provider</label>
                <select
                  value={settings.llmConfig.provider}
                  onChange={(e) => updateLLMConfig({ provider: e.target.value as LLMConfig['provider'] })}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  {providers.map((provider) => (
                    <option key={provider.value} value={provider.value}>
                      {provider.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  {providers.find(p => p.value === settings.llmConfig.provider)?.description}
                </p>
              </div>

              {settings.llmConfig.provider === 'openai' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">OpenAI API Key</label>
                    <Input
                      type="password"
                      value={settings.llmConfig.apiKey || ''}
                      onChange={(e) => updateLLMConfig({ apiKey: e.target.value })}
                      placeholder="sk-..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Model</label>
                    <Input
                      value={settings.llmConfig.model || 'gpt-3.5-turbo'}
                      onChange={(e) => updateLLMConfig({ model: e.target.value })}
                      placeholder="gpt-3.5-turbo"
                    />
                  </div>
                </>
              )}

              {settings.llmConfig.provider === 'anthropic' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Anthropic API Key</label>
                    <Input
                      type="password"
                      value={settings.llmConfig.apiKey || ''}
                      onChange={(e) => updateLLMConfig({ apiKey: e.target.value })}
                      placeholder="sk-ant-..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Model</label>
                    <Input
                      value={settings.llmConfig.model || 'claude-3-haiku-20240307'}
                      onChange={(e) => updateLLMConfig({ model: e.target.value })}
                      placeholder="claude-3-haiku-20240307"
                    />
                  </div>
                </>
              )}

              {settings.llmConfig.provider === 'custom' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">API URL</label>
                    <Input
                      value={settings.llmConfig.apiUrl || ''}
                      onChange={(e) => updateLLMConfig({ apiUrl: e.target.value })}
                      placeholder="https://api.example.com/v1/chat/completions"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">API Key</label>
                    <Input
                      type="password"
                      value={settings.llmConfig.apiKey || ''}
                      onChange={(e) => updateLLMConfig({ apiKey: e.target.value })}
                      placeholder="Your API key"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Model</label>
                    <Input
                      value={settings.llmConfig.model || ''}
                      onChange={(e) => updateLLMConfig({ model: e.target.value })}
                      placeholder="Model name"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Auto-Scraping</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoScrape"
                  checked={settings.autoScrapeEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, autoScrapeEnabled: e.target.checked }))}
                  className="rounded border-input"
                />
                <label htmlFor="autoScrape" className="text-sm font-medium">
                  Enable automatic product information extraction
                </label>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                When enabled, the extension will try to automatically extract product information from webpages.
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              <SaveIcon className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-muted-foreground">
            AI Shopping List Extension v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}