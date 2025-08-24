/**
 * Βοηθητικές συναρτήσεις για τη βελτίωση της συμβατότητας με διάφορους browsers
 */

// Ανίχνευση του browser
export function detectBrowser(): string {
  if (typeof window === "undefined") return "server"

  const userAgent = window.navigator.userAgent

  if (userAgent.indexOf("Chrome") > -1) {
    return "chrome"
  } else if (userAgent.indexOf("Safari") > -1) {
    return "safari"
  } else if (userAgent.indexOf("Firefox") > -1) {
    return "firefox"
  } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
    return "ie"
  } else if (userAgent.indexOf("Edge") > -1) {
    return "edge"
  } else {
    return "unknown"
  }
}

// Προσθήκη polyfills για παλαιότερους browsers
export function applyPolyfills(): void {
  if (typeof window === "undefined") return

  // Polyfill για το Object.entries
  if (!Object.entries) {
    Object.entries = (obj: any) => {
      const ownProps = Object.keys(obj)
      let i = ownProps.length
      const resArray = new Array(i)
      while (i--) {
        resArray[i] = [ownProps[i], obj[ownProps[i]]]
      }
      return resArray
    }
  }

  // Polyfill για το Array.from
  if (!Array.from) {
    Array.from = (arrayLike: any) => [].slice.call(arrayLike)
  }

  // Polyfill για το String.prototype.includes
  if (!String.prototype.includes) {
    String.prototype.includes = function (search: string, start?: number) {
      if (typeof start !== "number") {
        start = 0
      }
      if (start + search.length > this.length) {
        return false
      } else {
        return this.indexOf(search, start) !== -1
      }
    }
  }
}

// Διορθώσεις για συγκεκριμένους browsers
export function applyBrowserFixes(): void {
  if (typeof window === "undefined") return

  const browser = detectBrowser()

  // Διορθώσεις για Safari
  if (browser === "safari") {
    // Διόρθωση για το flexbox gap στο Safari
    const style = document.createElement("style")
    style.innerHTML = `
      .safari-flex-gap {
        display: flex;
        flex-wrap: wrap;
      }
      .safari-flex-gap > * {
        margin: 0.25rem;
      }
    `
    document.head.appendChild(style)
  }

  // Διορθώσεις για Internet Explorer
  if (browser === "ie") {
    // Διόρθωση για το CSS Grid στον IE
    const style = document.createElement("style")
    style.innerHTML = `
      .ie-grid-fix {
        display: flex;
        flex-wrap: wrap;
      }
      .ie-grid-fix > * {
        flex: 1 1 300px;
        margin: 0.5rem;
      }
    `
    document.head.appendChild(style)
  }
}

// Εφαρμογή όλων των διορθώσεων
export function initBrowserCompatibility(): void {
  if (typeof window === "undefined") return

  console.log(`Εφαρμογή διορθώσεων συμβατότητας για browser: ${detectBrowser()}`)

  applyPolyfills()
  applyBrowserFixes()

  // Προσθήκη κλάσης στο body για CSS διορθώσεις
  document.body.classList.add(`browser-${detectBrowser()}`)
}
