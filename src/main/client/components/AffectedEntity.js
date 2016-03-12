import React from 'react'
import moment from 'moment'

import { Panel, Row, Col, ButtonGroup, Button, Glyphicon, Input } from 'react-bootstrap'

import GtfsSearch from '../gtfs/gtfssearch'

/*var agencies = [
  {
    id: 'BA',
    name: 'BART'
  },
]*/

var modes = [
  {
    gtfsType: 0,
    name: 'Tram/LRT'
  },
  {
    gtfsType: 1,
    name: 'Subway/Metro'
  },
  {
    gtfsType: 2,
    name: 'Rail'
  },
  {
    gtfsType: 3,
    name: 'Bus'
  },
  {
    gtfsType: 4,
    name: 'Ferry'
  },
  {
    gtfsType: 5,
    name: 'Cable Car'
  },
  {
    gtfsType: 6,
    name: 'Gondola'
  },
  {
    gtfsType: 7,
    name: 'Funicular'
  }
]

export default class AffectedEntity extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {

    /*var modesContent =  (
      <Input
        type="select"
        onChange={(evt) => {
          //this.props.entityModeChanged(this.props.entity, evt.target.value)
        }}
        //value={this.props.entity.type}
      >
        {modes.map((mode) => {
          return <option value={mode.gtfsType}>{mode.name}</option>
        })}
      </Input>
    )*/

    return (
      <Panel header={
        <Row>
          <Col xs={2}>
            Affects:
          </Col>
          <Col xs={6}>
            <Input
              type="select"
              onChange={(evt) => {
                this.props.entityUpdated(this.props.entity, "TYPE", evt.target.value)
              }}
              value={this.props.entity.type}
            >
              <option value='AGENCY'>Agency</option>
              <option value='MODE'>Mode</option>
              <option value='STOP'>Stop</option>
              <option value='ROUTE'>Route</option>
            </Input>
          </Col>
          <Col xs={4}>
            <ButtonGroup className='pull-right'>
              <Button onClick={() => this.props.onDeleteEntityClick(this.props.entity)}>
                <Glyphicon glyph="remove" />
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      }>

        {(() => {
          var indent = {
            paddingLeft: '30px'
          }
          switch (this.props.entity.type) {
            case "AGENCY":
              return (
                <div>
                  <span><b>Agency:</b></span>
                  <AgencySelector 
                    feeds={this.props.feeds} 
                    entityUpdated={this.props.entityUpdated}
                    entity={this.props.entity}
                  />
                </div>
              )
            case "MODE":
              return (
                <div>
                  <span><b>Mode:</b></span>
                  <ModeSelector 
                    entityUpdated={this.props.entityUpdated}
                    value={this.props.entity.type}
                    entity={this.props.entity}
                  />
                  <div style={indent}>
                    <span><i>Refine by Agency:</i></span>
                    <AgencySelector feeds={this.props.feeds} />
                    <span><i>Refine by Stop:</i></span>
                    <StopSelector 
                      feeds={this.props.feeds} 
                      stop={this.props.entity.stop}
                      entityUpdated={this.props.entityUpdated}
                      entity={this.props.entity}
                    />
                  </div>
                </div>
              )
            case "STOP":
              return (
                <div>
                  <span><b>Stop:</b></span>
                  <StopSelector 
                    feeds={this.props.feeds} 
                    stop={this.props.entity.stop}
                    entityUpdated={this.props.entityUpdated}
                    entity={this.props.entity}
                  />
                  <div style={indent}>
                    <span><i>Refine by Route:</i></span>
                    <RouteSelector 
                      feeds={this.props.feeds} 
                      route={this.props.entity.route}
                      entityUpdated={this.props.entityUpdated}
                      entity={this.props.entity}
                    />
                  </div>
                </div>
              )
            case "ROUTE":
              return (
                <div>
                  <span><b>Route:</b></span>
                  <RouteSelector 
                    feeds={this.props.feeds} 
                    route={this.props.entity.route}
                    entityUpdated={this.props.entityUpdated}
                    entity={this.props.entity}
                  />
                  <div style={indent}>
                    <span><i>Refine by Stop:</i></span>
                    <StopSelector 
                      feeds={this.props.feeds} 
                      stop={this.props.entity.stop}
                      entityUpdated={this.props.entityUpdated}
                      entity={this.props.entity}
                    />
                  </div>
                </div>
              )

          }
        })()}

      </Panel>
    )
  }
}


class AgencySelector extends React.Component {

  render () {
    return (
      <div>
        <Input
          type="select"
          onChange={(evt) => {
            this.props.entityUpdated(this.props.entity, "AGENCY", evt.target.value)
          }}
          //value={this.props.entity.type}
        >
          {this.props.feeds.map((feed) => {
            return <option value={feed.id}>{feed.name}</option>
          })}
        </Input>
      </div>
    )
  }
}

class ModeSelector extends React.Component {

  render () {
    return (
      <div>
        <Input
          type="select"
          onChange={(evt) => {
            this.props.entityUpdated(this.props.entity, "MODE", evt.target.value)
          }}
          //value={this.props.entity.type}
        >
          {modes.map((mode) => {
            return <option value={mode.gtfsType}>{mode.name}</option>
          })}
        </Input>
      </div>
    )
  }
}

class RouteSelector extends React.Component {
  state = {
    route: this.props.route
  };
  render () {
    var routes = []
    return (
      <div>
        <GtfsSearch 
          feeds={this.props.feeds}
          entities={['routes']}
          onChange={(evt) => {
            console.log(this.state.value)
            if (typeof evt !== 'undefined' && evt !== null)
              this.props.entityUpdated(this.props.entity, "ROUTE", evt.route)
            else if (evt == null)
              this.props.entityUpdated(this.props.entity, "ROUTE", null)
          }}
          route={this.state.route ? {'value': this.state.route.route_id, 'label': `(${feedMap[route.feed_id]}) ${route.route_short_name !== null ? route.route_short_name : route.route_long_name} (route)`} : ''}
        />
      </div>
    )
  }
}

class StopSelector extends React.Component {
  state = {
    stop: this.props.stop
  };
  handleChange (input) {
    // this.props.onChange(input)
  }
  render () {
    console.log('render stop ent', this.props.stop)
    const feedMap = this.props.feeds.reduce((map, obj) => {
      map[obj.id] = obj.shortName !== null ? obj.shortName : obj.name;
      return map;
    })

    var stops = []
    return (
      <div>
        <GtfsSearch 
          feeds={this.props.feeds}
          entities={['stops']}
          onChange={(evt) => {
            console.log(this.state.value)
            if (typeof evt !== 'undefined' && evt !== null)
              this.props.entityUpdated(this.props.entity, "STOP", evt.stop)
            else if (evt == null)
              this.props.entityUpdated(this.props.entity, "STOP", null)
          }}
          stop={this.state.stop ? {'value': this.state.stop.stop_id, 'label': `(${feedMap[this.state.stop.feed_id]}) ${this.state.stop.stop_name}`} : ''}
        />
        
      </div>
    )
  }
}
