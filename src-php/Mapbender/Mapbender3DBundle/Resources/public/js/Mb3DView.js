(function ($) {
    'use strict';

    const CHANNEL = 'mb-3dview';
    const MESSAGE_TYPES = {
        INIT_VIEW: 'initView',
        REQUEST_VIEW: 'requestView',
        READY: 'ready',
        VIEW_CHANGED: 'viewChanged',
        EXIT_3D: "exit3d",
    };

    class Mb3DView extends MapbenderElement {
        constructor(configuration, $element) {
            super(configuration, $element);
            this.mbMap = null;
            this.$toggle = null;
            this.$panel = null;
            this.$frame = null;
            this.frameLoaded = false;
            this.isActive = false;
            this.last3dView = null;
            this.applyOnNext3dView = false;
            this.closeSyncTimer = null;
            this.mapViewChangeProxy = null;
            this.messageProxy = null;

            Mapbender.elementRegistry.waitReady('.mb-element-map').then(
                (mbMap) => this._setup(mbMap)
            );
        }

        _setup(mbMap) {
            this.mbMap = mbMap;
            this.$toggle = this.$element.find('.mb-3dview-toggle');
            this.$panel = this.$element.find('.mb-3dview-panel');
            this.$frame = this.$element.find('.mb-3dview-frame');

            this.$toggle.text(this.options.buttonLabel || '3D');
            this.$toggle.on('click', this._toggle.bind(this));
            this.$frame.on('load', this._handleFrameLoad.bind(this));

            this.mapViewChangeProxy = this._handleMapViewChanged.bind(this);
            this.mbMap.element.on('mbmapviewchanged', this.mapViewChangeProxy);

            this.messageProxy = this._handleFrameMessage.bind(this);
            window.addEventListener('message', this.messageProxy);

            this._trigger('ready');
        }

        _destroy() {
            if (this.mbMap && this.mapViewChangeProxy) {
                this.mbMap.element.off('mbmapviewchanged', this.mapViewChangeProxy);
            }
            if (this.messageProxy) {
                window.removeEventListener('message', this.messageProxy);
            }
            if (this.closeSyncTimer) {
                window.clearTimeout(this.closeSyncTimer);
            }
        }

        _toggle() {
            if (this.isActive) {
                this.deactivate();
            } else {
                this.activate();
            }
        }

        activate() {
            if (this.isActive) {
                return;
            }
            this.isActive = true;
            this.$toggle.attr('aria-pressed', 'true').addClass('is-active');
            this.$panel.removeClass('-hidden');
            this.$toggle.addClass("hidden");

            if (!this.frameLoaded) {
                this.$frame.attr('src', this.options.iframeUrl);
            } else {
                this._sendInitView();
            }
        }

        deactivate() {
            if (!this.isActive) {
                return;
            }
            this.isActive = false;
            this.$toggle.attr('aria-pressed', 'false').removeClass('is-active');
            this.$panel.addClass('-hidden');
            this.$toggle.removeClass("hidden");

            this._request3dViewForCloseSync();
        }

        _handleFrameLoad() {
            this.frameLoaded = true;
            if (this.isActive) {
                this._sendInitView();
            }
        }

        _handleMapViewChanged() {
            if (!this.isActive || !this.frameLoaded) {
                return;
            }
            this._sendInitView();
        }

        _handleFrameMessage(event) {
            if (!this.frameLoaded) {
                return;
            }
            if (event.origin !== window.location.origin) {
                return;
            }
            if (event.source !== this.$frame.get(0).contentWindow) {
                return;
            }

            var data = event.data || {};
            if (data.channel !== CHANNEL || !data.type) {
                return;
            }

            if (data.type === MESSAGE_TYPES.EXIT_3D && data.payload) {
                this._apply3dViewTo2d(data.payload);
                this._closeFromIframeSwitch();
                return;
            }
            if (data.type === MESSAGE_TYPES.VIEW_CHANGED && data.payload) {
                this.last3dView = data.payload;
                if (this.applyOnNext3dView) {
                    this.applyOnNext3dView = false;
                    if (this.closeSyncTimer) {
                        window.clearTimeout(this.closeSyncTimer);
                        this.closeSyncTimer = null;
                    }
                    this._apply3dViewTo2d(this.last3dView);
                }
            }

            if (data.type === MESSAGE_TYPES.READY && this.isActive) {
                this._sendInitView();
            }
        }

        _closeFromIframeSwitch() {
            this.applyOnNext3dView = false;
            if (this.closeSyncTimer) {
                window.clearTimeout(this.closeSyncTimer);
                this.closeSyncTimer = null;
            }
            this.isActive = false;
            this.$toggle.attr('aria-pressed', 'false').removeClass('is-active');
            this.$panel.addClass('-hidden');
            this.$toggle.removeClass('hidden');
        }

        _request3dViewForCloseSync() {
            if (!this.frameLoaded) {
                return;
            }
            this.applyOnNext3dView = true;
            this._postToFrame(MESSAGE_TYPES.REQUEST_VIEW, {});

            if (this.closeSyncTimer) {
                window.clearTimeout(this.closeSyncTimer);
            }
            this.closeSyncTimer = window.setTimeout(() => {
                this.applyOnNext3dView = false;
                if (this.last3dView) {
                    this._apply3dViewTo2d(this.last3dView);
                }
            }, 700);
        }

        _sendInitView() {
            var payload = this._collect2dViewFor3d();
            if (!payload) {
                return;
            }
            this._postToFrame(MESSAGE_TYPES.INIT_VIEW, payload);
        }

        _collect2dViewFor3d() {
            if (!this.mbMap || !this.mbMap.model) {
                return null;
            }

            var model = this.mbMap.model;
            var viewParams = model.getCurrentViewParams();
            var centerWgs84 = Mapbender.mapEngine.transformCoordinate({
                x: viewParams.center[0],
                y: viewParams.center[1]
            }, viewParams.srsName, 'EPSG:4326');

            return {
                center: [centerWgs84.x, centerWgs84.y],
                zoom: this._scaleToMapLibreZoom(viewParams.scale, centerWgs84.y),
                bearing: -1 * (viewParams.rotation || 0),
                pitch: 65
            };
        }

        _apply3dViewTo2d(viewState) {
            if (!viewState || !Array.isArray(viewState.center) || viewState.center.length < 2) {
                return;
            }
            var model = this.mbMap && this.mbMap.model;
            if (!model) {
                return;
            }

            var currentView = model.getCurrentViewParams();
            var projectedCenter = Mapbender.mapEngine.transformCoordinate({
                x: viewState.center[0],
                y: viewState.center[1]
            }, 'EPSG:4326', currentView.srsName);

            var options = {
                srsName: currentView.srsName,
                center: [projectedCenter.x, projectedCenter.y]
            };
            if (typeof viewState.zoom === 'number') {
                options.scale = this._mapLibreZoomToScale(
                    viewState.zoom,
                    viewState.center[1]
                );
            }
            if (typeof viewState.bearing === 'number') {
                options.rotation = -1 * viewState.bearing;
            }

            model.applyViewParams(options);
        }

        _postToFrame(type, payload) {
            var frame = this.$frame && this.$frame.get(0);
            if (!frame || !frame.contentWindow) {
                return;
            }
            frame.contentWindow.postMessage({
                channel: CHANNEL,
                type: type,
                payload: payload || {}
            }, window.location.origin);
        }

        _mapLibreZoomToScale(zoom, latitude) {
            var latRad = (latitude || 0) * Math.PI / 180;
            var equatorCircumference = 2 * Math.PI * 6378137;
            var metersPerPixel = Math.cos(latRad) * equatorCircumference / (256 * Math.pow(2, zoom));
            var dpi = parseFloat(this.mbMap.options.dpi) || 72;
            return metersPerPixel * dpi * 39.37;
        }

        _scaleToMapLibreZoom(scale, latitude) {
            if (!scale || scale <= 0) {
                return 16;
            }
            var dpi = parseFloat(this.mbMap.options.dpi) || 72;
            var metersPerPixel = scale / (dpi * 39.37);
            var latRad = (latitude || 0) * Math.PI / 180;
            var equatorCircumference = 2 * Math.PI * 6378137;
            var zoom = Math.log2(Math.cos(latRad) * equatorCircumference / (256 * metersPerPixel));
            return Math.max(0, Math.min(22, zoom));
        }
    }

    window.Mapbender.Element = window.Mapbender.Element || {};
    window.Mapbender.Element.Mb3DView = Mb3DView;
})(jQuery);


