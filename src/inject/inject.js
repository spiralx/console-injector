
function injectFromCdnJs (library) {
  function getURLs () {
    var xmlhttp = new XMLHttpRequest()

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === XMLHttpRequest.DONE) {
        if (xmlhttp.status === 200) {
          var libraries = JSON.parse(xmlhttp.responseText).results
          var foundLib = libraries.reduce(function (found, item) {
            if (item.name === library || item.name === library + '.js') {
              found = item
            }
            return found
          }, undefined)

          if (foundLib) {
            var url = foundLib.latest.replace('http:', 'https:')
            var libScript = document.createElement('script')
            libScript.src = url
            document.head.appendChild(libScript)
            return console.log('library injected from ' + url)
          } else {
            console.log('library "' + library + '" not found')
          }
        } else { console.log(xmlhttp.status) }
      }
    }

    var searchString = 'https://api.cdnjs.com/libraries?search=' + library
    xmlhttp.open('GET', searchString, true)
    xmlhttp.send()
  }

  getURLs()
}

// ------------------------------------------------------------

function injector (library) {

  /**
   * Create a script element to inject JavaScript into a page.
   *
   * @param {string} src  URL of script to be injected
   * @return {Promise<void>}
   */
  function injectScript (src) {
    return new Promise((resolve, reject) => {
      const se = Object.assign(document.createElement('script'), {
        onload (event) {
          // console.info(`Library "${library}" loaded from ${response.url}`)
          console.info(`onload(src="${src}")`, event)

          document.body.removeChild(se)
          resolve(event)
        },
        onerror: reject
      })

      document.body.appendChild(se)
      se.src = src
    })
  }

  // ------------------------------------------------------------

  async function injectFromUnpkg (library) {
    let url = `https://unpkg.com/${library}`

    try {
      const response = await fetch(url)

      if (response.url !== url) {
        url = response.url
      }
    } catch (ex) {
      console.warn(`Library "${library}" not found at ${url}`)
      return
    }

    try {
      await injectScript(url)
      console.info(`Library "${library}" loaded from "${url}"`)
    } catch (ex) {
      console.warn(`Error injecting library "${library}" from "${url}"`, ex)
    }
  }

  // ------------------------------------------------------------

  injectFromUnpkg(library)
}

// ------------------------------------------------------------

const element = document.createElement('script')
element.innerHTML = 'console.inject = ' + injector.toString()
document.head.appendChild(element)
