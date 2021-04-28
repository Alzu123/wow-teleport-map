import React from 'react'

import { Col, Container, Row } from 'react-bootstrap'
import ToggleTeleport from './ToggleTeleport'

function formatTimeText(seconds) {
  // The time is always in seconds or minutes so no need to handle anything else
  let minutes = Math.floor(seconds / 60)
  seconds = seconds - 60 * minutes 

  if (minutes > 0) {
    return `${minutes} min ${seconds} s`
  } else {
    return `${seconds} s`
  }
}

const NavigationSteps = ({ finalRoute, onClick }) => {
  if (!finalRoute) {
    return 'Couldn\'t find a route with the available teleports.'
  }
  const routeNodes = finalRoute.nodes.filter((_, i) => i !== 0 && i !== finalRoute.nodes.length - 0)
  const totalFlying = Math.round(finalRoute.totalTravelDistance + Number.EPSILON)
  const totalTime = Math.round(finalRoute.totalTime + Number.EPSILON)

  let shownSteps = []
  let runningKey = 1
  routeNodes.forEach(function(node) {
    if (node.distanceFromPreviousNode > 5) {
      shownSteps.push({
        name: node.origin.description,
        destination: node.origin,
        distance: node.distanceFromPreviousNode,
        isFlyable: node.origin.position.continent.isFlyable,
        isNode: false,
        key: runningKey
      })
      runningKey += 1
    }
    shownSteps.push({...node, isNode: true, key: runningKey})
    runningKey += 1
  })

  shownSteps = shownSteps.filter((_, i) => i !== shownSteps.length - 1)

  return (
    <Container className='no-side-padding navigation-steps'>
      <Row key={0} className='navigation-step-row '>
        <Col className='bold'>Current route</Col>
        <Col className='align-right muted'>{totalFlying} yd, {formatTimeText(totalTime)}</Col>
      </Row>

      {shownSteps.map(function(step) {
        if (step.isNode) {
          return (
            <Container className='no-side-padding navigation-step-row light-bottom-border' key={step.key}>
              <Row id={step.id}>
                <Col className='navigation-step-text'>{step.name}</Col>
                <Col className='align-right' xs={3}><ToggleTeleport onClick={onClick} teleport={step} text='Disable'/></Col>
              </Row>
              <Row>
                <Col className='muted inner'>to {step.destination.description}</Col>
              </Row>
            </Container>
          )
        } else {
          return (
            <Container className='no-side-padding navigation-step-row light-bottom-border' key={step.key}>
              <Row id={step.id}>
                <Col className='navigation-step-text'>Fly to {step.name}</Col>
                <Col className='align-right muted' xs={3}>{Math.round(step.distance)} yards</Col>
              </Row>
            </Container>
          )
        }
          
      })}
    </Container>
  )
}

export default NavigationSteps