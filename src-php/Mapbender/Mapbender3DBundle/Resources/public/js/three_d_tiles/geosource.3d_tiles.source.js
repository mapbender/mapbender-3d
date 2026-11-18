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
}

window.Mapbender = Mapbender || {};
window.Mapbender.ThreeDTilesSource = ThreeDTilesSource;
Mapbender.Source.typeMap['3dtiles'] = ThreeDTilesSource;
