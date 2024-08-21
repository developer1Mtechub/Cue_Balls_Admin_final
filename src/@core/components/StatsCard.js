// ** Third Party Components
import classnames from 'classnames'
import { TrendingUp, User, Box, DollarSign } from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col, DropdownMenu, ButtonDropdown, DropdownToggle, DropdownItem } from 'reactstrap'
import { useState } from 'react'

const StatsCard = ({ cols ,total_participants_running_game,
  entry_fee_running_game,
  commission_running_game,
  jackpot_running_game,
  game_statusRunning,
  returnStatusChanger
}) => {

    const [dropdownOpen, setDropdownOpen] = useState(false)

    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen)
    }
  const data = [
    {
      title: entry_fee_running_game,
      subtitle: 'Entry Fee',
      color: 'light-success',
      icon:<DollarSign size={24} />
    },
    {
      title: commission_running_game,
      subtitle: 'Commissiom',
      color: 'light-info',
      icon:<TrendingUp size={24} />
    },
    {
      title: total_participants_running_game,
      subtitle: 'Total Participants',
      color: 'light-info',
      icon:  <User size={24} />
    },
    {
      title: jackpot_running_game,
      subtitle: 'Jackpot',
      color: 'light-success',
      icon: <DollarSign size={24} />
    }
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
            <Avatar color={item.color} icon={item.icon} className='me-2' />
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
        <CardTitle tag='h4'>Scheduled Game</CardTitle>
        {/* status  */}
        <ButtonDropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
      <DropdownToggle color={
    game_statusRunning === 'scheduled' ? 'danger' :
    game_statusRunning === 'waiting' ? 'primary' :
    game_statusRunning === 'started' ? 'info' :
    game_statusRunning === 'completed' ? 'success' :
    'primary' // default color
  }  caret>
      {game_statusRunning}
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem disabled={game_statusRunning==='scheduled'||game_statusRunning==='waiting'} onClick={()=>{
          console.log('scheduled')
          returnStatusChanger('scheduled')
        }}>Scheduled</DropdownItem>
        <DropdownItem disabled={game_statusRunning==='waiting'||game_statusRunning==='started'}
        onClick={()=>{
          console.log('waiting')
          returnStatusChanger('waiting')

        }}>Waiting </DropdownItem>
        <DropdownItem disabled={game_statusRunning==='started'||game_statusRunning==='scheduled'}
        onClick={()=>{
          console.log('started')
          returnStatusChanger('started')

        }}>Started</DropdownItem>
        {/* <DropdownItem disabled={game_statusRunning==='completed'}
        onClick={()=>{
          console.log('completed')
          returnStatusChanger('completed')

        }}>Completed</DropdownItem> */}

      </DropdownMenu>
    </ButtonDropdown>
      </CardHeader>
      <CardBody className='statistics-body'>
        <Row>{renderData()}</Row>
      </CardBody>
    </Card>
  )
}

export default StatsCard
