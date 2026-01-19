import { Moon, Sun, Check } from 'lucide-react'
import { clsx } from 'clsx'
import { useSettings } from '../../hooks/useSettings'
import { FontSize } from '../../types/settings'

const ACCENT_COLORS = [
  { name: 'Cyan', value: '#06b6d4', recommended: true },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Green', value: '#10b981' },
  { name: 'Orange', value: '#f59e0b' },
  { name: 'Pink', value: '#ec4899' },
]

const FONT_SIZES: Array<{ value: FontSize; label: string; description: string }> = [
  { value: 'small', label: 'Small', description: '14px base' },
  { value: 'medium', label: 'Medium', description: '16px base' },
  { value: 'large', label: 'Large', description: '18px base' },
]

export function AppearanceTab() {
  const { settings, updateSettings } = useSettings()

  return (
    <div className="space-y-8">
      {/* Theme Selection */}
      <div>
        <h3 className="text-lg font-semibold text-surface-50 mb-1">Theme</h3>
        <p className="text-sm text-surface-400 mb-4">Choose your preferred color scheme</p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => updateSettings({ appearance: { ...settings.appearance, theme: 'dark' } })}
            className={clsx(
              'p-6 rounded-xl border-2 text-left transition-all duration-200 relative',
              settings.appearance.theme === 'dark'
                ? 'border-accent bg-accent/10'
                : 'border-surface-700/50 bg-surface-800/30 hover:border-surface-600 hover:bg-surface-800/50'
            )}
          >
            <div className="flex items-start gap-4">
              <div className={clsx(
                'p-3 rounded-lg',
                settings.appearance.theme === 'dark' ? 'bg-accent/20 text-accent' : 'bg-surface-700/50 text-surface-400'
              )}>
                <Moon className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold text-surface-50 text-lg mb-1">Dark</div>
                <p className="text-sm text-surface-400">Easy on the eyes</p>
              </div>
            </div>
            {settings.appearance.theme === 'dark' && (
              <div className="absolute top-4 right-4">
                <div className="bg-accent text-surface-950 rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              </div>
            )}
          </button>

          <div className="p-6 rounded-xl border-2 border-surface-700/50 bg-surface-800/30 text-left opacity-60 cursor-not-allowed relative">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-surface-700/50 text-surface-400">
                <Sun className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold text-surface-50 text-lg mb-1">Light</div>
                <p className="text-sm text-surface-400">Bright and clean</p>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-surface-700/50 text-surface-400">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accent Color */}
      <div>
        <h3 className="text-lg font-semibold text-surface-50 mb-1">Accent Color</h3>
        <p className="text-sm text-surface-400 mb-4">Choose your primary highlight color</p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {ACCENT_COLORS.map((color) => {
            const isSelected = settings.appearance.accentColor === color.value
            return (
              <button
                key={color.value}
                onClick={() => updateSettings({ appearance: { ...settings.appearance, accentColor: color.value } })}
                className={clsx(
                  'p-4 rounded-xl border-2 transition-all duration-200 relative',
                  isSelected
                    ? 'border-[var(--color)] bg-[var(--color)]/10'
                    : 'border-surface-700/50 bg-surface-800/30 hover:border-surface-600 hover:bg-surface-800/50'
                )}
                style={{ '--color': color.value } as React.CSSProperties}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg ring-2 ring-surface-700"
                    style={{ backgroundColor: color.value }}
                  />
                  <div className="text-left flex-1">
                    <div className="font-semibold text-surface-200 text-sm flex items-center gap-2">
                      {color.name}
                      {color.recommended && (
                        <span className="px-1.5 py-0.5 text-xs rounded bg-accent/20 text-accent">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="rounded-full p-0.5" style={{ backgroundColor: color.value }}>
                      <Check className="w-3 h-3 text-surface-950" />
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Custom Color Picker */}
        <div className="p-4 rounded-xl bg-surface-800/30 border border-surface-700/50">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="color"
                value={settings.appearance.accentColor}
                onChange={(e) => updateSettings({ appearance: { ...settings.appearance, accentColor: e.target.value } })}
                className="w-8 h-8 rounded-lg cursor-pointer border-2 border-surface-700"
              />
            </div>
            <div>
              <div className="font-medium text-surface-200">Custom Color</div>
              <div className="text-sm text-surface-400 font-mono">{settings.appearance.accentColor}</div>
            </div>
          </label>
        </div>
      </div>

      {/* Font Size */}
      <div>
        <h3 className="text-lg font-semibold text-surface-50 mb-1">Font Size</h3>
        <p className="text-sm text-surface-400 mb-4">Adjust text size for better readability</p>

        <div className="flex gap-2">
          {FONT_SIZES.map((size) => {
            const isSelected = settings.appearance.fontSize === size.value
            return (
              <button
                key={size.value}
                onClick={() => updateSettings({ appearance: { ...settings.appearance, fontSize: size.value } })}
                className={clsx(
                  'flex-1 p-4 rounded-xl border-2 transition-all duration-200',
                  isSelected
                    ? 'border-accent bg-accent/10'
                    : 'border-surface-700/50 bg-surface-800/30 hover:border-surface-600 hover:bg-surface-800/50'
                )}
              >
                <div className={clsx(
                  'font-semibold mb-1',
                  isSelected ? 'text-surface-50' : 'text-surface-200'
                )}>
                  {size.label}
                </div>
                <div className="text-xs text-surface-400">
                  {size.description}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Accessibility */}
      <div>
        <h3 className="text-lg font-semibold text-surface-50 mb-1">Accessibility</h3>
        <p className="text-sm text-surface-400 mb-4">Motion and animation preferences</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-800/30 border border-surface-700/50">
            <div>
              <div className="font-medium text-surface-200">Reduce Motion</div>
              <div className="text-sm text-surface-400 mt-1">Minimize animations and transitions</div>
            </div>
            <button
              onClick={() => updateSettings({ appearance: { ...settings.appearance, reducedMotion: !settings.appearance.reducedMotion } })}
              className={clsx(
                'relative w-12 h-6 rounded-full transition-colors duration-200',
                settings.appearance.reducedMotion ? 'bg-accent' : 'bg-surface-700'
              )}
            >
              <div className={clsx(
                'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200',
                settings.appearance.reducedMotion ? 'translate-x-6' : 'translate-x-0.5'
              )} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-800/30 border border-surface-700/50">
            <div>
              <div className="font-medium text-surface-200">Show Animations</div>
              <div className="text-sm text-surface-400 mt-1">Display chart and UI animations</div>
            </div>
            <button
              onClick={() => updateSettings({ appearance: { ...settings.appearance, showAnimations: !settings.appearance.showAnimations } })}
              className={clsx(
                'relative w-12 h-6 rounded-full transition-colors duration-200',
                settings.appearance.showAnimations ? 'bg-accent' : 'bg-surface-700'
              )}
            >
              <div className={clsx(
                'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200',
                settings.appearance.showAnimations ? 'translate-x-6' : 'translate-x-0.5'
              )} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
