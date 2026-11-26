class ThreeDTilesSourceLayer extends Mapbender.SourceLayer {

    constructor(definition, source, parent) {
        super(definition, source, parent);
    }

    hasBounds() {
        return false;
    }

    getBounds(projCode, inheritFromParent) {
        return null;
    }

    intersectsExtent(extent, srsName) {
        return true;
    }

    supportsProjection(srsName) {
        return true;
    }

    getLegend(forPrint) {
        return null;
    }
}


window.Mapbender = Mapbender || {};
window.Mapbender.ThreeDTilesSourceLayer = ThreeDTilesSourceLayer;
Mapbender.SourceLayer.typeMap['3dtiles'] = ThreeDTilesSourceLayer;
