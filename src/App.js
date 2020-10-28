import React from 'react';
import './App.css';
import axios from 'axios';

// GitHub usernames for testing: gaearon, sophiebits, sebmarkbage, bvaughn

/// Test data array:
// const testData = 
// [
//   {name: "Dan Abramov", avatar_url: "https://avatars0.githubusercontent.com/u/810438?v=4", company: "@facebook"},
//   {name: "Sophie Alpert", avatar_url: "https://avatars2.githubusercontent.com/u/6820?v=4", company: "Humu"},
//   {name: "Sebastian Markbåge", avatar_url: "https://avatars2.githubusercontent.com/u/63648?v=4", company: "Facebook"},
// ];

const CardList = (props) => 
(
  <div>
    {props.profiles.map(profile => <Card key={profile.id} {...profile} />)}
  </div>
);

class Card extends React.Component
{
  render()
  {
    const profile = this.props;
    return (
      <div className="gitHub-profile" style={{ margin: "1rem" }}>
        <img src={profile.avatar_url} alt=""/>
        <div className="info" style={{ display: "inline-block", marginLeft: 10 }}>
          <div className="name" style={{ fontSize: "125%" }}>{profile.name}</div>
          <div className="company">{profile.company}</div>
        </div>
      </div>
    );
  }
}

class Form extends React.Component
{
  /// Ezzel tudunk hivatkozni a tagre és lekérni adatokat, mint egy DOM element.
  // userNameInput = React.createRef();
  
  state = { userName: "" };

  /// async promise await-hez kell
  handleSubmit = async (event) =>
  {
    /// Ha nincs prevenDefault, akkor minden egyes submit után az oldal frissül.
    /// The preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.
    /// In this case: Clicking on a "Submit" button, prevent it from submitting a form.
    event.preventDefault();

    /// ask webpage API for data
    /// axios return a promise
    const resp = await axios.get(`https://api.github.com/users/${this.state.userName}`);
    this.props.onSubmit(resp.data);
    this.setState({ userName: "" });
    
    // console.log(this.userNameInput.current.value);
    // console.log(this.state.userName);
    // console.log(resp.data);
  }

  render()
  {
    return (
      <form onSubmit={this.handleSubmit}>
        <input 
          type="text" 
          placeholder="GitHub username" 

          /// ref property, azért kell, hogy az input értéket le tudjam kérni.
          // ref={this.userNameInput} 
          
          /// state = { userName: "" } objektumhoz
          /// value property megkapja a state objektumot és React irányítja a value-t
          /// onChange event, miatt a DOM szól a reactnek, hogy változás történt
          value={this.state.userName}
          onChange={event => this.setState({ userName: event.target.value })}

          required
        />
        <button>Add card</button>
      </form>
    );
  }
}

class App extends React.Component
{
  /// Ez egy konstruktor, ezért írtuk, hogy a CardList tag ne globális változóként kapja meg a testData tömböt. Végül ki lett kommentelve, mert alatta van egy rövidebb verzió a state objektum.
  /*constructor(props)
  {
    super(props);
    this.state = 
    {
      profiles: testData,
    };
  }*/

  /// "useState"-tel ellentétben, ez csak objektum lehet.
  state = 
  {
    profiles: [],
  };

  addNewProfile = (profileData) =>
  {
    this.setState(prevState =>
    ({
      profiles: [...prevState.profiles, profileData],
    }));
  };

  render()
  {
    return (
      <div>
        <div className="header">{this.props.title}</div>
        <Form onSubmit={this.addNewProfile} />
        <CardList profiles={this.state.profiles} />
      </div>
    );
  }
}

export default App;
