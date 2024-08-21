// ** React Imports
import { Link } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Third Party Components
import {
  User,
  Mail,
  CheckSquare,
  MessageSquare,
  Settings,
  CreditCard,
  HelpCircle,
  Power,
} from "react-feather";

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";

// ** Default Avatar Image

const UserDropdown = () => {
  
  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div className="user-nav d-sm-flex d-none">
        <span style={{color:'white',backgroundColor:'#F5BC01 ',borderRadius:'50%',padding:'10px',marginRight:'10px',marginBottom:'2px'}}>
          A
        </span>
          <span className="user-name fw-bold" >ADMIN</span>
          {/* <span className="user-status">Admin</span> */}
        </div>
       
        {/* <Avatar
          img={defaultAvatar}
          imgHeight="40"
          imgWidth="40"
          status="online"
        /> */}
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem tag={Link} to="/change_password_profile" onClick={(e) => {e.preventDefault()
        window.location.href = "/change_password_profile" 
        }}>
          <User size={14} className="me-75" />
          <span className="align-middle">Change Password</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/" onClick={(e) => {
          e.preventDefault()
          window.location.href = "/privacy-policy"
          }}>
          <Mail size={14} className="me-75" />
          <span className="align-middle">Privacy Policy</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/terms-conditions" onClick={(e) => {e.preventDefault()
        window.location.href = "/terms-conditions"
        }}>
          <CheckSquare size={14} className="me-75" />
          <span className="align-middle">Terms & Conditions</span>
        </DropdownItem>
        <DropdownItem  onClick={()=>{
        localStorage.removeItem("@AdminCB");
        window.location.href = "/login";
        }}>
          <Power size={14} className="me-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;
