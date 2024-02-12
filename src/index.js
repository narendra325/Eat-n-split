import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);

  const [friends, setFriends] = useState(initialFriends);

  const [selected, setSelectd] = useState(null);

  function HandleFriends(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleShowSplit(friend) {
    //setSelectd(friend);
    setSelectd((cur) => (cur?.id === friend.id ? null : friend));
  }

  function handleSplitBILL(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selected.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectd(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selected={selected}
          onselectfriend={handleShowSplit}
        />
        {showAddFriend && <FormAddFriend onAddFriend={HandleFriends} />}
        <Button onClick={handleAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selected && (
        <FormSplitBill selected={selected} onsplitBill={handleSplitBILL} />
      )}
    </div>
  );
}

function FriendsList({ friends, onselectfriend, selected }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selected={selected}
          onselectfriend={onselectfriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onselectfriend, selected }) {
  const isSelect = selected?.id === friend.id;
  return (
    <li className={isSelect ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(Math.trunc(friend.balance))}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe the ${Math.trunc(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onselectfriend(friend)}>
        {isSelect ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState();
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=499476");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriends = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
      id,
    };
    onAddFriend(newFriends);

    setImage("https://i.pravatar.cc/48?u=499476");
    setName("");
  }

  return (
    <form className="form-add-friend " onSubmit={handleSubmit}>
      <label>😊Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>📸Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selected, onsplitBill }) {
  const [bill, setBill] = useState("");
  const [paidbyUser, setPaidbyuser] = useState("");
  const paidbyFriend = bill ? bill - paidbyUser : "";
  const [whoisPaying, setWhoisPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidbyUser) return;
    onsplitBill(whoisPaying === "user" ? paidbyFriend : -paidbyUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>SPLIT A BILL WITH A {selected.name} </h2>
      <label>💰Bill value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>😊Your Expenses</label>
      <input
        type="number"
        value={paidbyUser}
        onChange={(e) =>
          setPaidbyuser(
            Number(e.target.value) > bill ? paidbyUser : Number(e.target.value)
          )
        }
      />
      <label>😊{selected.name}'s expense</label>
      <input type="text" disabled value={paidbyFriend} />
      <label>🤑Who is paying the bill?</label>
      <select
        value={whoisPaying}
        onChange={(e) => setWhoisPaying(e.target.value)}
      >
        <option value="user">you</option>
        <option value="friend">{selected.name} </option>
      </select>
      <Button>Split Bill </Button>
    </form>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
