const {BrowserRouter, Link, Route, Switch} = ReactRouterDOM;
const Router = BrowserRouter;
const {useRouteMatch, useParams, useLocation} = ReactRouterDOM;



class Header extends React.Component {
    render() {
    return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{backgroundColor: "#2c2c2c"}}>
    <div class="container-fluid">
        <a class="navbar-brand text-center" herf="#"><i className="bi bi-calendar-range"></i>  {this.props.name}</a> 
        <button type="button" class="btn btn-outline-danger me-2">Log out</button>    
    </div>               
    </nav>
    );
    }
}

class Home extends React.Component {
	render() {
	  return (
	  <>
      <div className="container-fluid m-2">	  
	  <h2>Home</h2>
      <p>Hello Peter, nothing new!</p>
      </div>
	  </>
	  );
	}
}

class NoMatch extends React.Component{
	render() {
		return(
		<div className="container m-2">
	    <h3>
		 Wrong path!
	    </h3>
	    </div>
		);
	}
}

class Profile extends React.Component {
	render() {
	  return (
	  <>
      <div className="container m-2">	  
	  <h2>Profile</h2>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Username: Peter</li>
        <li class="list-group-item">User ID: 12345678</li>
        <li class="list-group-item">Email address: abc@example.com</li>
      </ul>
      </div>
      <Link to="/profile/update">Update Profile</Link>
	  </>
	  );
	}
}

class Update extends React.Component{
	render() {
		return(
            <>
            <div className="container m-2">	  
            <h2>Update Profile</h2>
            <p>Tip: You can keep the box empty if you don't want to change that part</p>
            <form>
              <label for="username"><i className="bi bi-person-fill"></i> New username</label>
              <input id="username" className="form-control mb-3" placeholder="New Username"></input>
              <label for="email"><i className="bi bi-envelope-fill"></i> New email address</label>
              <input type="email" id="email" className="form-control mb-3" placeholder="New Email Address"></input>
              <label for="password"><i className="bi bi-lock-fill"></i> New password</label>
              <input id="password" className="form-control mb-3" placeholder="New Password"></input>
              <Link to="/profile" onClick={()=>alert('Updated!')}>Update</Link>
            </form>
            </div>
            </>
		);
	}
}

class Timetable extends React.Component {
	render() {
	  return (
	  <>
    <div className="container m-2">	  
	  <h2>My Timetable</h2>
    <h3 className="text-center">Mar 28 - Apr 3</h3>
      <table class="table table-hover">
      <thead>
      <tr className="table-info">
      <th scope="col" colSpan="2">Mar 28, Sunday</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th scope="row" style={{width: 200}}>09:30 - 10:20</th>
        <td>Event 1</td>
      </tr>
      <tr>
      <th scope="row">11:30 - 14:00</th>
        <td>Event 2</td>
      </tr>
      </tbody>
      <thead>
      <tr className="table-info">
      <th scope="col" colSpan="2">Apr 1, Thursday</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th scope="row">09:30 - 10:20</th>
        <td>Event 1</td>
      </tr>
      <tr>
      <th scope="row">11:30 - 14:00</th>
        <td>Event 2</td>
      </tr>
      </tbody>
      </table>
      </div>
      <Link to="/timetable/add">Add event</Link>
	  </>
	  );
	}
}

class AddEvent extends React.Component{
	render() {
		return(
            <>
            <div className="container m-2">	  
            <h2>Add Event</h2>
            <form>
              <label for="startDateTime">Start at:</label>
              <input id="startDateTime" className="form-control mb-3" type="datetime-local"></input>
              <label for="endDateTime">End at:</label>
              <input id="endDateTime" className="form-control mb-3" type="datetime-local"></input>
              <label for="event">Event name:</label>
              <input id="event" className="form-control mb-3" placeholder="Event name"></input>
            </form>
            <Link to="/timetable" onClick={()=>alert('Add new event!')}>Add</Link>
            <br></br>  
            <Link to="/timetable" onClick={()=>alert('Cancel')}>Cancel</Link>
            </div>
            </>
		);
	}
}

class App extends React.Component {
    render() {
    return (
    <>
    <Header name={this.props.name}/>
    <Router>
      <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <ul className="navbar-nav">
          <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
          <li className="nav-item"><Link to="/profile" className="nav-link">Profile</Link></li>
          <li className="nav-item"><Link to="/timetable" className="nav-link">My Timetable</Link></li>
        </ul>
      </nav>
      
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/profile" component={Profile} />
          <Route path="/profile/update" component={Update} />
          <Route exact path="/timetable" component={Timetable} />
          <Route path="/timetable/add" component={AddEvent} />
          <Route path="*" component={NoMatch} />
        </Switch>
      </div>
    </Router>
    </>
    );
    }
}
ReactDOM.render(<App name="Gathable"/>, document.querySelector("#app"));