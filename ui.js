class ui extends EventTarget {
    constructor() {
        super();

        const self = this;
        self._listenScreenSize();
        self.triggerUpdateScreen();
    }

    emit(title, content = {}) {
        const self = this;

        if (title) {
            self.dispatchEvent(new CustomEvent(title, { detail: content }));
        }
    }

    _debounce(callback, wait) {
        let timeoutId = null;
        return (...args) => {
            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => {
                callback(...args);
            }, wait);
        };
    }

    _listenScreenSize() {
        const self = this;

        const debounceEvent = self._debounce((e) => {
            self.triggerUpdateScreen();
        }, 300);

        window.addEventListener('resize', debounceEvent);
    }

    triggerUpdateScreen() {
        const self = this;

        self.emit('screen-resize', {
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    isTablet() {
        const self = this;

        return ( window.innerWidth >= 501 && window.innerWidth <= 768 );
    }

    isMobile() {
        const self = this;

        return ( window.innerWidth <= 500 );
    }

}

export default new ui();