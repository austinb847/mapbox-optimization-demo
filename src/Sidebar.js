import React from 'react'
import { Button, Icon } from 'semantic-ui-react'

function Sidebar() {








  return (
    <div className='info-box'>
          <h1>Trip Optimizer</h1>
          <p>Click to add Locations to visit:</p>
          <Button icon labelPosition='left' value='-87.675171,42.055984' name='college' onClick={(e) => this.addLocation(e, 'value')}>  
            <Icon name='graduation cap' />
            Northwestern University
          </Button>
          <br/>
          <br/>
          <Button icon labelPosition='left' value='-87.681546, 42.046177' name='restaurant' onClick={(e) => this.addLocation(e, 'value')}>
            <Icon name='utensils' />
            Restaurant
          </Button>
          <br/>
          <br/>
          <Button icon labelPosition='left' value='-87.680730, 42.048753' name='hotel' onClick={(e) => this.addLocation(e, 'value')}>
            <Icon name='hotel' />
            Hotel
          </Button>
          <br/>
          <br/>
          <Button icon labelPosition='left' value='-86.5126,39.1754' name='college' onClick={(e) => this.addLocation(e, 'value')}>  
            <Icon name='graduation cap' />
            Indiana University
          </Button>
          <br/>
          <br/>
          <Button icon labelPosition='left' value='-86.529617,39.167554' name='restaurant' onClick={(e) => this.addLocation(e, 'value')}>
            <Icon name='utensils' />
            Restaurant
          </Button>
          <br/>
          <br/>
          <Button icon labelPosition='left' value='-86.535488,39.170568' name='hotel' onClick={(e) => this.addLocation(e, 'value')}>
            <Icon name='hotel' />
            Hotel
          </Button>
          <br/>
          <br/>
          <div className="map-overlay">
						<h4 id="overview">Trip Duration:</h4>
          </div>
        </div>
  )
}

export default Sidebar
