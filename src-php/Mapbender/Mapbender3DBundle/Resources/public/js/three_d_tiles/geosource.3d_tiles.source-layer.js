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
        // Per Tile JSON spec, vector tiles are always in Web Mercator
        return null;
    }

    getLegend(forPrint) {
        return null;
    }
}


window.Mapbender = Mapbender || {};
window.Mapbender.ThreeDTilesSourceLayer = ThreeDTilesSourceLayer;
Mapbender.SourceLayer.typeMap['3dtiles'] = ThreeDTilesSourceLayer;
