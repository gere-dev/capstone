import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { authThunk, selectAuth } from '../../features/auth';
import { FaCircleUser } from 'react-icons/fa6';
import { IoLogoCodepen, IoIosLogOut } from 'react-icons/io';

export const Layout = ({ children }: { children: React.ReactNode }) => {
	const [currentPath, setCurrentPath] = useState<string>('products');

	const { user } = useAppSelector(selectAuth);
	const location = useLocation();

	const dispatch = useAppDispatch();

	useEffect(() => {
		const setPathName = () => {
			setCurrentPath(location.pathname);
		};
		setPathName();
	}, [location.pathname]);

	return (
		<section className="flex flex-row grap-2">
			{/* SideBar */}
			<aside className="h-screen w-58 px-2 border-r border-gray-100 flex flex-col">
				{/* Logo */}
				<span className="flex items-center h-12">
					<Link className="pl-1" to={'/'}>
						<IoLogoCodepen size={40} />
					</Link>
				</span>

				<nav className="flex-1  flex flex-col justify-between">
					{/* Navs */}
					<ul className="flex flex-col gap-4 mt-5 w-full">
						<NavLink lable="Home" pathName="/" currentPath={currentPath} />
						<NavLink lable="Suppliers" pathName="/suppliers" currentPath={currentPath} />
						<NavLink lable="Orders" pathName="/orders" currentPath={currentPath} />
					</ul>

					<button
						onClick={() => dispatch(authThunk.logout())}
						className=" w-full rounded py-2 mb-12 cursor-pointer flex gap-2 items-center pl-1 hover:bg-gray-200/70"
					>
						<IoIosLogOut />
						<span>Logout</span>
					</button>
				</nav>
			</aside>
			{/* Main */}
			<section className="flex flex-col w-full px-2 ">
				<div className="flex justify-end  h-12  items-center">
					<span className="flex gap-2 items-center mr-8">
						<h2>{user?.name}</h2>
						<FaCircleUser size={25} />
					</span>
				</div>
				{/* Pages */}
				<div className="mt-2">{children}</div>
			</section>
		</section>
	);
};

const NavLink = ({ pathName, lable, currentPath }: { pathName: string; lable: string; currentPath: string }) => {
	return (
		<li className={`w-full hover:bg-gray-100  rounded ${currentPath === pathName ? 'bg-gray-100' : ''}`}>
			<Link className="block pl-1 py-2" to={pathName}>
				{lable}
			</Link>
		</li>
	);
};
