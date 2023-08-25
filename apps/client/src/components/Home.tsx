import { useState, useEffect } from "react";
import { Grid, Typography, Link } from "@mui/material";
import axios from "axios";


function Home(): JSX.Element {
	const [problems, setProblems] = useState([]);

	useEffect(() => {
		axios.get("http://localhost:3000/problem/")
			.then((res) => {
				setProblems(res.data);
			});
	}, [])
	return (
		<Grid container style={{
			background: "#eee",
			marginTop: 50
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
						<Typography color="gray" width="50px">Edit</Typography>
					</div>

					{problems.map((problem, index) => {
						console.log(problem.title)
						return <Problem key={problem._id} title={problem.title} index={index} />
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
}
function Problem(props: ProblemProps): JSX.Element {
	const bgColor = props.index % 2 === 0 ? "#eee" : "#fff";
	const slug = props.title.split(".")[1].trim().split(" ").join("-").toLowerCase();
	console.log(slug)

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
			<Typography></Typography>
		</div>
	);
}

export default Home;