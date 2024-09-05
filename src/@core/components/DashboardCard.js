// ** Third Party Components
import classnames from 'classnames'
import { TrendingUp, User, Box, DollarSign } from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col, DropdownMenu, ButtonDropdown, DropdownToggle, DropdownItem } from 'reactstrap'
import { useState } from 'react'
import imageusers from "../../assets/images/pages/man.png"
import balls from "../../assets/images/pages/game.png"
import deleteds from "../../assets/images/pages/deleted.png"

const DashboardCard = ({ cols ,deleted_users,
  total_users,
  total_game,
}) => {

  
  const data = [
    {
      title: total_users,
      subtitle: 'Total Users',
      color: 'light-success',
      icon:<img src={imageusers} />
    },
    {
      title: total_game,
      subtitle: 'Total Games',
      color: 'light-info',
      icon:<img src={balls} />
    },
    {
      title: deleted_users,
      subtitle: 'Deleted Users',
      color: 'light-info',
      icon:  <img src={deleteds} />
    },
    
  ]

  const renderData = () => {
    return data.map((item, index) => {
      const colMargin = Object.keys(cols)
      const margin = index === 2 ? 'sm' : colMargin[0]
      return (
        <Col
          key={index}
          {...cols}
          className={classnames({
            [`mb-2 mb-${margin}-0`]: index !== data.length - 1
          })}
        >
          <div className='d-flex align-items-center'>
            <Avatar color={item.color} variant="square" icon={item.icon} className='me-2' />
            <div className='my-auto'>
              <h4 className='fw-bolder mb-0'>{item.title}</h4>
              <CardText className='font-small-3 mb-0'>{item.subtitle}</CardText>
            </div>
          </div>
        </Col>
      )
    })
  }

  return (
    <Card className='card-statistics'>
      <CardHeader>
        <CardTitle tag='h4'>Dashboard</CardTitle>
        {/* status  */}
      
      </CardHeader>
      <CardBody className='statistics-body'>
        <Row>{renderData()}</Row>
      </CardBody>
    </Card>
  )
}

export default DashboardCard
