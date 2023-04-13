import {
	ParentMessageNav,
	StyledBiCommentAdd,
	StyledHiOutlineUser,
	StyledHiOutlineUserGroup,
	StyledMdOutlineTravelExplore,
} from "./LeftSideHeader.styled";
import { Nav, Colors } from "../../chat.functions";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAppDispatch } from "../../../hooks/reduxHooks";
import { logOut } from "../../../store/authReducer";
import { Button, Menu } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { HiOutlineUser, HiOutlineUserGroup } from "react-icons/hi";
import { BiCommentAdd } from "react-icons/bi";
import { MdOutlineTravelExplore } from "react-icons/md";

interface LeftSideHeaderProps {
	user: any;
	socket: any;
	Navbar: Nav;
	setNavbar: (nav: Nav) => void;
	setConversations: (conversations: any) => void;
}

function LeftSideHeader({
	user,
	socket,
	Navbar,
	setNavbar,
	setConversations,
}: LeftSideHeaderProps) {
	const dispatch = useAppDispatch();
	const handleNavbarClick = async (nav: Nav) => {
		setConversations([]);
		const getToken = async () => {
			try {
				const response = await axios.get("http://localhost:3001/token", {
					withCredentials: true,
				});
				localStorage.setItem("auth", JSON.stringify(response.data));
				return response.data.token;
			} catch (err) {
				dispatch(logOut());
				window.location.reload();
				return null;
			}
		};
		if (nav === Nav.DIRECT) {
			const token = await getToken();
			try {
				const result = await axios.get("http://localhost:3001/chat/direct", {
					withCredentials: true,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				console.log(result.data);
				setConversations(result.data);
			} catch (err) {
				setConversations([]);
				console.log(err);
			}
		}
		else if (nav === Nav.GROUPS) {
			const token = await getToken();
			try {
				const result = await axios.get("http://localhost:3001/chat/groups", {
					withCredentials: true,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setConversations(result.data);
			} catch (err) {
				setConversations([]);
				console.log(err);
			}
		}
		else if (nav === Nav.EXPLORE) {
			const token = await getToken();
			try {
				const result = await axios.get("http://localhost:3001/chat/explore", {
					withCredentials: true,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setConversations(result.data);
			} catch (err) {
				setConversations([]);
				console.log(err);
			}
		}
		setNavbar(nav);
	};

	useEffect(() => {
		handleNavbarClick(Navbar);
	}, [Navbar]);

	return (
		<>
			<ParentMessageNav>
				<StyledHiOutlineUser
					onClick={() => handleNavbarClick(Nav.DIRECT)}
					color={Navbar === Nav.DIRECT ? Colors.WHITE : Colors.PRIMARY}
					size={30}
				/>
				<StyledHiOutlineUserGroup
					onClick={() => handleNavbarClick(Nav.GROUPS)}
					color={Navbar === Nav.GROUPS ? Colors.WHITE : Colors.PRIMARY}
					size={30}
				/>
				<StyledBiCommentAdd
					onClick={() => handleNavbarClick(Nav.CREATE)}
					color={Navbar === Nav.CREATE ? Colors.WHITE : Colors.PRIMARY}
					size={30}
				/>
				<StyledMdOutlineTravelExplore
					onClick={() => handleNavbarClick(Nav.EXPLORE)}
					color={Navbar === Nav.EXPLORE ? Colors.WHITE : Colors.PRIMARY}
					size={30}
				/>
			</ParentMessageNav>
		</>
	);
	// const [collapsed, setCollapsed] = useState(false);
	// const [selectedNav, setSelectedNav] = useState('');
  
	// const toggleCollapsed = () => {
	//   setCollapsed(!collapsed);
	// };
  
	// return (
	// 	<div style={{ width: 256 }}>
	// 	  <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
	// 		{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
	// 	  </Button>
	// 	  <Menu
	// 		defaultSelectedKeys={['']}
	// 		mode="inline"
	// 		theme="dark"
	// 		inlineCollapsed={collapsed}
	// 		onSelect={(item) => setSelectedNav(item.key.toString())}
	// 		selectedKeys={[selectedNav]}
	// 	  >
	// 		<Menu.Item key="direct" icon={<HiOutlineUser size={30} color={selectedNav === 'direct' ? 'white' : '#1890ff'} />} onClick={() => handleNavbarClick(Nav.DIRECT)}>
	// 		  Direct
	// 		</Menu.Item>
	// 		<Menu.Item key="groups" icon={<HiOutlineUserGroup size={30} color={selectedNav === 'groups' ? 'white' : '#1890ff'} />} onClick={() => handleNavbarClick(Nav.GROUPS)}>
	// 		  Groups
	// 		</Menu.Item>
	// 		<Menu.Item key="create" icon={<BiCommentAdd size={30} color={selectedNav === 'create' ? 'white' : '#1890ff'} />} onClick={() => handleNavbarClick(Nav.CREATE)}>
	// 		  Create
	// 		</Menu.Item>
	// 		<Menu.Item key="explore" icon={<MdOutlineTravelExplore size={30} color={selectedNav === 'explore' ? 'white' : '#1890ff'} />} onClick={() => handleNavbarClick(Nav.EXPLORE)}>
	// 		  Explore
	// 		</Menu.Item>
			
	// 	  </Menu>
	// 	</div>
	//   );
	};

export default LeftSideHeader;
