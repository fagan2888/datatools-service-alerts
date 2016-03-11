import React, { PropTypes } from 'react'
import $ from 'jquery'

import fetch from 'isomorphic-fetch'

import { Panel, Grid, Row, Col, Button } from 'react-bootstrap'

import { PureComponent, shallowEqual } from 'react-pure-render'

import { Map, Marker, Popup, TileLayer, Polyline, MapControl } from 'react-leaflet'

import config from '../config'

import Select from 'react-select'

export default class GtfsMap extends React.Component {
  static propTypes = {
    attribution: PropTypes.string,
    centerCoordinates: PropTypes.arrayOf(PropTypes.number),
    geojson: PropTypes.arrayOf(PropTypes.object).isRequired,
    markers: PropTypes.arrayOf(PropTypes.object).isRequired,
    onZoom: PropTypes.func,
    transitive: PropTypes.object,
    url: PropTypes.string.isRequired,
    zoom: PropTypes.number
  };

  constructor(props) {
    super(props)
    const position = [37.779871, -122.426966]
    this.state = {
      stops: [],
      message: '',
      position: position,
      map: {}
    }
  }

  componentDidMount() {
    // this.fetchUsers()
    console.log(this.props)

  }

  render() {
    const {attribution, centerCoordinates, geojson, markers, transitive, url, zoom} = this.props


    const handleSelection = (input) => {
      this.onChange(input)
    }


    const polyline = [
      [37.779871, -122.426966],
      [37.78, -122.426966],
      [37.79, -122.426966],
    ]
    var mapStyle = {
      height: '400px',
      width: '555px'
    // WebkitTransition: 'all', // note the capital 'W' here
    // msTransition: 'all' // 'ms' is the only lowercase vendor prefix
    }
    const layerAddHandler = (e) => {
      console.log(e)
      if (this.props.stops.length === 1 && typeof e.layer !== 'undefined' && typeof e.layer._popup !== 'undefined'){
        e.layer.openPopup()
      }
    }
    const moveHandler = (zoom) => {
      const newZoom = zoom.target._zoom
      console.log(newZoom)
      if (newZoom > 13 ){
        this.setState(Object.assign({}, this.state, { message: '' }))
        const bounds = zoom.target.getBounds()
        // const maxLat = bounds._northEast.lat
        // const maxLng = bounds._northEast.lng
        // const minLat = bounds._southWest.lat
        // const minLng = bounds._southWest.lng

        const maxLat = bounds._southWest.lat
        const maxLng = bounds._northEast.lng
        const minLat = bounds._northEast.lat
        const minLng = bounds._southWest.lng

        this.getStopsForBox(maxLat, maxLng, minLat, minLng)
      }
      else{
        this.setState(Object.assign({}, this.state, { message: 'zoom in for stops' }))
      }

      // console.log(something)
    }
    return (
    <div>
      <div>&nbsp;</div>
      <Map
        style={mapStyle}
        center={this.state.position}
        zoom={13}
        onLeafletZoomend={moveHandler}
        onLeafletMoveend={moveHandler}
        onLeafletLayeradd={layerAddHandler}
        className='Gtfs-Map'
        >
        <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
        {this.props.stops.map((stop, index) => {
          if (typeof stop !== 'undefined') {
            return (
              <Marker
                position={[stop.stop_lat, stop.stop_lon]}
                key={`marker-${stop.stop_id}`}
                >
                <Popup>
                  <div>
                    <h3>{stop.stop_name}</h3>
                    <ul>
                      <li><strong>ID:</strong> {stop.stop_id}</li>
                      <li><strong>Agency:</strong> BART</li>
                      {stop.stop_desc && <li><strong>Desc:</strong> {stop.stop_desc}</li>}
                    </ul>
                    <Button href="#" onClick={() => this.props.onStopClick(stop)}>Create Alert for {stop.stop_id}</Button>
                  </div>
                </Popup>
              </Marker>
            )
          }
        })}
        {this.state.stops.map((stop, index) => {
          if (typeof stop !== 'undefined') {
            return (
              <Marker
                position={[stop.stop_lat, stop.stop_lon]}
                key={`marker-${stop.stop_id}`}
                >
                <Popup>
                  <div>
                    <h3>{stop.stop_name}</h3>
                    <ul>
                      <li><strong>ID:</strong> {stop.stop_id}</li>
                      <li><strong>Agency:</strong> BART</li>
                      {stop.stop_desc && <li><strong>Desc:</strong> {stop.stop_desc}</li>}
                    </ul>
                    <Button href="#" onClick={() => this.props.onStopClick(stop)}>Create Alert for {stop.stop_id}</Button>
                  </div>
                </Popup>
              </Marker>
            )
          }
        })}
      </Map>
    </div>
    )
  }

  getStopsForBox(maxLat, maxLng, minLat, minLng){
    const feedIds = this.props.feeds.map(feed => feed.id)
    // console.log(feedIds)
    return fetch(`/api/stops?max_lat=${maxLat}&max_lon=${maxLng}&min_lat=${minLat}&min_lon=${minLng}&feed=${feedIds.toString()}`)
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          console.log(json)
          this.setState(Object.assign({}, this.state, { stops: json }))
          return json
        })
  }
}
class StopPopup extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      stop: this.props.stop
    }
  }

  componentDidMount() {
    // this.fetchUsers()

  }
  render() {
    const stop = this.state.stop
    return (
      <Popup>
        <div>
          <h3>{stop.stop_name}</h3>
          <ul>
            <li><strong>ID:</strong> {stop.stop_id}</li>
            <li><strong>Agency:</strong> BART</li>
            {stop.stop_desc && <li><strong>Desc:</strong> {stop.stop_desc}</li>}
          </ul>
          <Button href="#">Create Alert for {stop.stop_id}</Button>
        </div>
      </Popup>
    )
  }
}

