import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { authThunk, selectAuth } from '../../features/auth';
import { FaCircleUser } from 'react-icons/fa6';
import { IoLogoCodepen, IoIosLogOut } from 'react-icons/io';
import type { IconType } from 'react-icons/lib';
import { RiAlignItemRightFill } from 'react-icons/ri';
import { FaShoppingBag } from 'react-icons/fa';
import { MdHomeRepairService } from 'react-icons/md';
import { BiSolidReport } from 'react-icons/bi';
import { MdCategory } from 'react-icons/md';

export const Layout = ({ children }: { children: React.ReactNode }) => {
	const [currentPath, setCurrentPath] = useState<string>('products');

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
			<aside className="h-screen w-90  border-r border-gray-100 flex flex-col bg-primary text-white">
				{/* Logo */}
				<span className="flex items-center h-24 pl-6  ">
					<Link to={'/'}>
						<IoLogoCodepen size={60} />
					</Link>
				</span>

				<nav className="flex-1  flex flex-col justify-between">
					{/* Navs */}
					<ul className="flex flex-col gap-1  w-full ">
						<NavLink lable="Inventory" pathName="/" currentPath={currentPath} Icon={RiAlignItemRightFill} />
						<NavLink lable="Orders" pathName="/orders" currentPath={currentPath} Icon={FaShoppingBag} />
						<NavLink
							lable="Suppliers"
							pathName="/suppliers"
							currentPath={currentPath}
							Icon={MdHomeRepairService}
						/>
						<NavLink
							lable="Categories"
							pathName="/categories"
							currentPath={currentPath}
							Icon={MdCategory}
						/>
						<NavLink lable="Report" pathName="/report" currentPath={currentPath} Icon={BiSolidReport} />
					</ul>

					<button
						onClick={() => dispatch(authThunk.logout())}
						className=" w-full rounded pl-6 mb-12 cursor-pointer flex gap-2 items-center "
					>
						<IoIosLogOut />
						<span>Logout</span>
					</button>
				</nav>
			</aside>
			{/* Main */}
			<section className="flex flex-col w-full px-2 ">
				<div className="">{children}</div>
			</section>
		</section>
	);
};

const NavLink = ({
	pathName,
	lable,
	currentPath,
	Icon,
}: {
	pathName: string;
	lable: string;
	currentPath: string;
	Icon: IconType;
}) => {
	return (
		<li
			className={`w-full hover:bg-secondary  text-gray-400 z-10 pl-6  ${currentPath === pathName ? 'bg-secondary text-white' : ''}`}
		>
			<Link className={`pl-1 py-4 flex items-center gap-3 text-lg`} to={pathName}>
				<Icon size={25} />
				{lable}
			</Link>
		</li>
	);
};
