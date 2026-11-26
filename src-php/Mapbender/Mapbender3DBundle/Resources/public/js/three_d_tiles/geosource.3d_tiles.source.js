class ThreeDTilesSource extends Mapbender.Source {

    cachedFeatureInfo = {};

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

    cacheFeatureInfo(click, properties) {
        this.cachedFeatureInfo[click.x + "/" + click.y] = properties;
        console.log(this.cachedFeatureInfo);
    }

    loadFeatureInfo(mapModel, x, y, options, elementId) {
        console.log(mapModel, x, y, options);

        if (this.cachedFeatureInfo && this.cachedFeatureInfo[x + "/" + y]) {
            const properties = this.cachedFeatureInfo[x + "/" + y];
            const featureContent = this.createFeatureInfoForProperties(properties, x, y, mapModel.getCurrentProjectionCode());
            if (featureContent) {
                const content = document.createElement('div');
                content.appendChild(featureContent);
                Mapbender?.FeatureInfo?.setupHighlight(content, this.id, elementId);
                return [null, Promise.resolve(content)];
            }
        }

        return [null, Promise.resolve(null)];
    }

    createFeatureInfoForProperties(properties, x, y, epsg) {
        const featureInfo = this.options.featureInfo;
        const label = properties.label || properties.name || properties.title || properties[this.options.buildingIdProperty];

        if (!label && featureInfo?.hideIfNoTitle) return null;

        const geometryDiv = document.createElement('div');
        geometryDiv.className = 'geometryElement';
        geometryDiv.id = this.options.id + '/' + x + '/' + y;
        geometryDiv.setAttribute('data-geometry', `POINT (${x} ${y})`);
        geometryDiv.setAttribute('data-srid', epsg);
        geometryDiv.setAttribute('data-label', label);

        if (label) {
            const h5 = document.createElement('h5');
            h5.className = 'featureinfo__title';
            h5.textContent = label;
            geometryDiv.appendChild(h5);
        }

        const table = document.createElement('table');
        table.className = 'table table-striped table-bordered table-condensed featureinfo__table';
        const tbody = document.createElement('tbody');
        table.appendChild(tbody);

        let propertyMap = null;
        if (featureInfo?.propertyMap) {
            propertyMap = {};
            for (const entry of featureInfo.propertyMap) {
                if (typeof entry === 'string') {
                    propertyMap[entry] = Mapbender.trans(entry);
                } else {
                    const [key, value] = Object.entries(entry)[0];
                    propertyMap[key] = Mapbender.trans(value);
                }
            }
        }
        Object.entries(properties).forEach(([key, value]) => {
            if (propertyMap && !propertyMap[key]) return;

            const row = document.createElement('tr');
            const headerCell = document.createElement('th');
            headerCell.textContent = propertyMap?.[key] || key;
            const dataCell = document.createElement('td');
            dataCell.textContent = value;
            row.appendChild(headerCell);
            row.appendChild(dataCell);
            tbody.appendChild(row);
        });

        geometryDiv.appendChild(table);
        return geometryDiv;
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
                mappingProperty: this.options.mappingProperty,
                surfaceProperty: this.options.mappingProperty,
                buildingIdProperty: this.options.buildingIdProperty,
                defaultColor: this.options.style.defaultColor,
                ...this.options.style.mappingColors,
            }
        }

        return json;
    }

}

window.Mapbender = Mapbender || {};
window.Mapbender.ThreeDTilesSource = ThreeDTilesSource;
Mapbender.Source.typeMap['3dtiles'] = ThreeDTilesSource;
