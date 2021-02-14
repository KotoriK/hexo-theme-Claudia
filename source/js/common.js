window.$claudia = {
    throttle: function (func, time) {
        let wait = false
        return function () {
            if (wait) return
            wait = true

            setTimeout(function () {
                func()
                wait = false
            }, time || 100)
        }
    },
    fadeInImage: function (imgs, imageLoadedCallback) {
        const images = imgs || document.querySelectorAll('.js-img-fadeIn')

        function loaded(event) {
            const image = event.currentTarget
            image.classList.add('show')
            if (image.parentElement && image.parentElement.classList.contains('skeleton')) {
                image.parentElement.classList.remove('skeleton')
            }
            imageLoadedCallback && imageLoadedCallback(image)
        }

        images.forEach(function (img) {
            if (img.complete) {
                return loaded({ currentTarget: img })
            }

            img.addEventListener('load', loaded)
        })
    },
    blurBackdropImg: function (image) {
        if (!image.dataset.backdrop) return

        const parent = image.parentElement //TODO: Not finish yes, must be a pure function
        const parentWidth = Math.round(parent.getBoundingClientRect().width)
        const childImgWidth = Math.round(image.getBoundingClientRect().width)
        const vw15 = screen.availWidth * 0.15
        const isCovered = (parentWidth - childImgWidth) < vw15
        const blurImg = parent.previousElementSibling ?? document.querySelector('.post-cover-backdrop') //TODO: Not finish yes, must be a pure function

        isCovered ? (blurImg.classList.add('is-hidden'), $claudia.adjust(parent, image, true)) : (blurImg.classList.remove('is-hidden'), $claudia.adjust(parent, image, false))
    },
    /**
     * 
     * @param {HTMLElement} element 
     * @param {HTMLImageElement} img
     * @param {boolean} adjustOn
     */
    adjust: (parent, img, adjustOn) => {
        if (adjustOn) {
            img.classList.remove('show')
            parent.style.backgroundImage = `url(${img.src})`
            parent.classList.add('img-cover-centre')
        } else {
            img.classList.add('show')
            parent.style.backgroundImage = ''
            parent.classList.remove('img-cover-centre')
        }
    },
    getSystemTheme(callback) {
        const media = window.matchMedia('(prefers-color-scheme: dark)')
        media.addEventListener('change', function (e) {
            callback && callback(e.matches ? "dark" : "light")
        })

        callback && callback(media.matches ? 'dark' : 'light')
    }
}
