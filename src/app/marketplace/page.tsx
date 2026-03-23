'use client'

import Script from 'next/script'
import { useEffect } from 'react'

export default function MarketplacePage() {
  // Force light theme on this page only
  useEffect(() => {
    const html = document.documentElement
    const originalTheme = html.getAttribute('data-theme') || 'dark'
    
    // Set light theme
    html.setAttribute('data-theme', 'light')
    html.classList.add('light')
    html.classList.remove('dark')
    
    // Restore original theme when leaving page
    return () => {
      html.setAttribute('data-theme', originalTheme)
      if (originalTheme === 'dark') {
        html.classList.add('dark')
        html.classList.remove('light')
      } else {
        html.classList.add('light')
        html.classList.remove('dark')
      }
    }
  }, [])

  return (
    <>
      {/* Shopify Buy Button Script */}
      <Script
        src="https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if ((window as any).ShopifyBuy && (window as any).ShopifyBuy.UI) {
            const client = (window as any).ShopifyBuy.buildClient({
              domain: 'swqtx2-z2.myshopify.com',
              storefrontAccessToken: 'db4a3ef899f653e334757557b8ab8fba',
            })
            
            ;(window as any).ShopifyBuy.UI.onReady(client).then((ui: any) => {
              ui.createComponent('collection', {
                id: '292162404446',
                node: document.getElementById('collection-component-1774238539516'),
                moneyFormat: '%24%7B%7Bamount%7D%7D',
                options: {
                  product: {
                    styles: {
                      product: {
                        '@media (min-width: 601px)': {
                          'max-width': 'calc(25% - 20px)',
                          'margin-left': '20px',
                          'margin-bottom': '50px',
                          width: 'calc(25% - 20px)'
                        },
                        img: {
                          height: 'calc(100% - 15px)',
                          position: 'absolute',
                          left: '0',
                          right: '0',
                          top: '0'
                        },
                        imgWrapper: {
                          'padding-top': 'calc(75% + 15px)',
                          position: 'relative',
                          height: '0'
                        }
                      }
                    },
                    text: {
                      button: 'Add to cart'
                    }
                  },
                  productSet: {
                    styles: {
                      products: {
                        '@media (min-width: 601px)': {
                          'margin-left': '-20px'
                        }
                      }
                    }
                  },
                  modalProduct: {
                    contents: {
                      img: false,
                      imgWithCarousel: true,
                      button: false,
                      buttonWithQuantity: true
                    },
                    styles: {
                      product: {
                        '@media (min-width: 601px)': {
                          'max-width': '100%',
                          'margin-left': '0px',
                          'margin-bottom': '0px'
                        }
                      }
                    },
                    text: {
                      button: 'Add to cart'
                    }
                  },
                  cart: {
                    text: {
                      total: 'Subtotal',
                      button: 'Checkout'
                    }
                  },
                  toggle: {}
                }
              })
            })
          }
        }}
      />

      <div className="min-h-screen pt-20 pb-24 overflow-x-hidden bg-white">
        <div className="pf-container max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
            <p className="text-gray-600">Official Porterful merch — all sales support independent artists</p>
          </div>

          {/* Info Banner */}
          <div className="bg-gradient-to-r from-orange-50 to-purple-50 rounded-xl p-4 mb-8 border border-orange-200">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🛒</div>
              <div>
                <p className="font-medium text-gray-900">Fast & Reliable Shipping</p>
                <p className="text-sm text-gray-600">All products printed on demand and shipped directly to you</p>
              </div>
            </div>
          </div>

          {/* Shopify Collection */}
          <div id="collection-component-1774238539516"></div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              Checkout powered by Shopify — Your purchase supports independent artists
            </p>
          </div>
        </div>
      </div>
    </>
  )
}