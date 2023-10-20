import axios from "axios";
import edit from '../assets/edit.png'
import { useState, useEffect } from "react";
import { Grid, Typography, Link } from "@mui/material";
import EditIcon from "../assets/EditIcon";
import { useRecoilValue } from "recoil";
import { userIdState } from "../store/selectors/user";


function Home(): JSX.Element {
	const [problems, setProblems] = useState([]);
	const userId = useRecoilValue(userIdState);

	useEffect(() => {
		axios.get("http://localhost:3000/problem/")
			.then((res) => {
				console.log("Homepage request:")
				console.log(res.data)
				setProblems(res.data);
			});
	}, [])
	let posted = false;
	for (let i = 0; i < problems.length; i++)
		if (!!userId && userId === problems[i].userId) {
			posted = true;
			break;
		}
	return (
		<Grid container style={{
			width: "100%",
			marginTop: 50,
			paddingBottom: 20,
			background: "#eee",
		}}>
			<Grid item lg={3} md={1} sm={0} xs={0} />
			<Grid item lg={6} md={10} sm={12} xs={12}>
				<div style={{
					background: "#fff",
					padding: 0,
					borderRadius: 5,
					boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
					transition: "0.3s",
				}}>
					<div style={{
						display: "flex",
						justifyContent: "space-between",
						height: "40px",
						alignItems: "center",
					}}>
						<div style={{
							display: "flex",
							alignItems: "center",
						}}>
							<Typography color="gray" marginLeft="20px" width="80px">Status</Typography>
							<Typography color="gray">Title</Typography>
						</div>
						{posted && <Typography color="gray" width="50px">Edit</Typography>}
					</div>

					{problems.map((problem, index) => {
						let editable = false;
						if (!!userId && userId === problem.userId) 
							editable = true;
						return <Problem key={problem._id} title={problem.title} index={index} editable={editable} />
					})}
				</div>

			</Grid>
			<Grid item lg={2} md={1} sm={0} xs={0} />
		</Grid>
	);
}
interface ProblemProps {
	key: string;
	title: string;
	index: number;
	editable: boolean;
}
function Problem(props: ProblemProps): JSX.Element {
	const bgColor = props.index % 2 === 0 ? "#eee" : "#fff";
	const slug = props.title.split(".")[1].trim().split(" ").join("-").toLowerCase();

	return (
		<div style={{
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			background: bgColor,
			height: "40px",
		}}>
			<div style={{
				display: "flex",
				alignItems: "center"
			}}>
				<Typography color="gray" width="100px"></Typography>
				<Typography><Link href={`problems/${slug}`} underline="none" color="inherit" sx={{
					"&:hover": {
						color: "#1976d2",
					}
				}}>{props.title}</Link></Typography>
			</div>

			{props.editable && <Link
				href={`edit/${slug}`}
				color="#000"
				width="45px"
				sx={{
					":hover": { color: "#1976d2 !important" }
				}}
			>
				<EditIcon fontSize="32px" color="inherit" />
			</Link>}

		</div>
	);
}

export default Home;