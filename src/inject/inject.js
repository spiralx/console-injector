function inject (library) {
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

async function inject2 (library) {
  const url = `https://unpkg.com/${library}`

  try {
    const response = await fetch(url)

    const se = document.createElement('script')
    se.type = 'text/javascript'
    se.src = url

    document.body.appendChild(se)

    console.info(`Library "${library}" loaded from ${response.url}`)
  } catch (ex) {
    console.warn(`Library "${library}" not found at ${url}`)
  }
}

// ------------------------------------------------------------

const element = document.createElement('script')
element.innerHTML = 'console.inject = ' + inject2.toString()
document.head.appendChild(element)
