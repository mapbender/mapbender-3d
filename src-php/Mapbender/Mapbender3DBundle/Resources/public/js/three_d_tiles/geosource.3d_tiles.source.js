class ThreeDTilesSource extends Mapbender.Source {

    constructor(definition) {
        definition.children = [{
            ...definition,
            options: {
                ...definition.options,
                // prefixing id, otherwise an id clash between another layer and the source id is possible
                id: '3d_' + definition.options.id,
            }
        }];
        super(definition);
    }

    createNativeLayers(srsName, mapOptions) {
        return [];
    }

    getPrintConfigs(bounds, scale, srsName) {
        return [];
    }

    getSelected() {
        return this.getRootLayer().getSelected();
    }

    updateEngine() {

    }

    featureInfoEnabled() {
        return this.getRootLayer().state.info;
    }

    loadFeatureInfo(mapModel, x, y, options, elementId) {
        return [null, Promise.resolve([])];
    }

    supportsMode(mode) {
        return mode === '3d';
    }

    toJSON(mode) {
        if (mode !== '3d') {
            return super.toJSON(mode);
        }

        const json = {
            id: this.id,
            type: '3dtiles',
            name: this.options.title,
            variant: this.options.variant,
            url: this.options.jsonUrl,
            opacity: this.options.opacity,
        };

        if (json.variant === 'pointcloud') {
            json.pointSize = this.options.pointSize;
        }

        if (json.variant === 'lod2') {
            json.style = {
                surfaceProperty: this.options.surfaceProperty,
                buildingIdProperty: this.options.buildingIdProperty,
                roofColor: this.options.roofColor,
                wallColor: this.options.wallColor,
                selectionColor: this.options.selectionColor,
            }
        }

        return json;
    }

}

window.Mapbender = Mapbender || {};
window.Mapbender.ThreeDTilesSource = ThreeDTilesSource;
Mapbender.Source.typeMap['3dtiles'] = ThreeDTilesSource;
