import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import $ from "jquery";

var XYZSource = new XYZ({
        url: 'http://localhost:10000/dynamic/visualize.cgi/plots/CEMETERY_plot/tile-{z}-{x}-{y}.png',
        tileSize: [256, 256],
        wrapX: false,
    });

var requestsArray = {};
var requestsJson;

var d = new Date();
const start = d.getTime();

XYZSource.setTileLoadFunction(function(tile, src) {

    //$("#requestedTiles").append("<b>"+src+"</b>");

    var r = /tile-(\d+)-(\d+)-(\d+)\.png/g
    var results = r.exec(src);

    var tileJson = {};
    tileJson.z = results[1];
    tileJson.x = results[2];
    tileJson.y = results[3];

    var cD = new Date();

    requestsArray[cD.getTime() - start] = JSON.parse(JSON.stringify(tileJson));

    console.log(requestsArray);

    requestsJson = JSON.stringify(requestsArray);
    $("#requestedTiles").html(requestsJson);

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(requestsJson);
    $("#dlLink").attr("href", dataStr);

    tile.getImage().src = src;

});

const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM({
                "url" : "http://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
            })
        }),
        new Tile({
            source: XYZSource
        })
    ],
    view: new View({
        center: [0, 0],
        zoom: 0
    })
});

$("#filename").change(function () {
    $("#dlLink").attr("download", this.value);
});