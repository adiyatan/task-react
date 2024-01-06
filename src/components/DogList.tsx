import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

interface Dog {
  id: number;
  image: string;
  name: string;
  type: string;
  favFood: string;
  description: string;
}

const DogList: React.FC = () => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newDogData, setNewDogData] = useState({
    image: "",
    name: "",
    type: "",
    favFood: "",
    description: "",
  });
  const [successAlert, setSuccessAlert] = useState(false);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await axios.get<Dog[]>(import.meta.env.VITE_API_URL);
        setDogs(response.data);
      } catch (error) {
        console.error("Error fetching dogs:", error);
      }
    };

    fetchDogs();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDogs = dogs.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleAddDog = async () => {
    try {
      const randomDogResponse = await axios.get("https://random.dog/woof.json");

      const response = await axios.post(
        "https://api.adiyatan.com/api/lazyDog/dogs",
        {
          ...newDogData,
          image: randomDogResponse.data.url,
        }
      );

      setDogs((prevDogs) => [...prevDogs, response.data]);
      setShowModal(false);
      setNewDogData({
        image: "",
        name: "",
        type: "",
        favFood: "",
        description: "",
      });
      closeModal();
      setSuccessAlert(true);
    } catch (error) {
      console.error("Error adding dog:", error);
    }
  };

  const handleDeleteDog = async (id: number) => {
    try {
      await axios.delete(`https://api.adiyatan.com/api/lazyDog/dogs/${id}`);
      setDogs((prevDogs) => prevDogs.filter((dog) => dog.id !== id));
    } catch (error) {
      console.error("Error deleting dog:", error);
    }
  };

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingDog, setEditingDog] = useState<Dog | null>(null);

  const handleEditDog = async (id: number) => {
    try {
      const response = await axios.get(
        `https://api.adiyatan.com/api/lazyDog/${id}`
      );
      const dogDetails = response.data;
      setEditingDog(dogDetails);
      setEditModalVisible(true);
      setSuccessAlert(true);
    } catch (error) {
      console.error("Error fetching dog details for editing:", error);
    }
  };

  const handleUpdateDog = async () => {
    if (!editingDog) {
      return;
    }

    try {
      const response = await axios.put(
        `https://api.adiyatan.com/api/lazyDog/dogs/${editingDog.id}`,
        editingDog
      );
      const updatedDog = response.data;

      // Update the state to reflect the changes
      setDogs((prevDogs) =>
        prevDogs.map((dog) => (dog.id === updatedDog.id ? updatedDog : dog))
      );

      // Close the edit modal
      setEditModalVisible(false);
    } catch (error) {
      console.error("Error updating dog:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setEditingDog(null);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    if (successAlert) {
      setTimeout(() => {
        setSuccessAlert(false);
      }, 3000); // Hide the alert after 3 seconds
    }
  }, [successAlert]);

  return (
    <div>
      <h1>Joyful Dog List</h1>
      <button onClick={openModal}>Add Dog</button>

      {successAlert && (
        <div className="success-alert">
          <p>Dog added successfully!</p>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>Add Dog</h2>
            <form>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={newDogData.name}
                  onChange={(e) =>
                    setNewDogData({ ...newDogData, name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Type:</label>
                <input
                  type="text"
                  value={newDogData.type}
                  onChange={(e) =>
                    setNewDogData({ ...newDogData, type: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Fav Food:</label>
                <input
                  type="text"
                  value={newDogData.favFood}
                  onChange={(e) =>
                    setNewDogData({ ...newDogData, favFood: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={newDogData.description}
                  onChange={(e) =>
                    setNewDogData({
                      ...newDogData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <button type="button" onClick={handleAddDog}>
                Add Dog
              </button>
            </form>
          </div>
        </div>
      )}

{editingDog && (
        <div className={`modal ${editModalVisible ? "modal-visible" : ""}`}>
          <div className="modal-content">
            <span className="close" onClick={handleCancelEdit}>
              &times;
            </span>
            <h2>Edit Dog</h2>
            <form>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={editingDog.name}
                  onChange={(e) =>
                    setEditingDog({ ...editingDog, name: e.target.value })
                  }
                />
              </div>

              {/* Add the additional fields for editing */}
              <div className="form-group">
                <label>Type:</label>
                <input
                  type="text"
                  value={editingDog.type}
                  onChange={(e) =>
                    setEditingDog({ ...editingDog, type: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Fav Food:</label>
                <input
                  type="text"
                  value={editingDog.favFood}
                  onChange={(e) =>
                    setEditingDog({ ...editingDog, favFood: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={editingDog.description}
                  onChange={(e) =>
                    setEditingDog({
                      ...editingDog,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              {/* Add an alert for editing success */}
              {successAlert && (
                <div className="success-alert">
                  <p>Dog updated successfully!</p>
                </div>
              )}

              <button type="button" onClick={handleUpdateDog}>
                Update Dog
              </button>
            </form>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Type</th>
            <th>Fav Food</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentDogs.map((dog, index) => (
            <tr key={dog.id}>
              <td>{index + 1 + indexOfFirstItem}</td>
              <td>
                <img
                  src={dog.image}
                  alt={dog.name}
                  style={{ maxWidth: "100px", maxHeight: "100px" }}
                />
              </td>
              <td>{dog.name}</td>
              <td>{dog.type}</td>
              <td>{dog.favFood}</td>
              <td>{dog.description}</td>
              <td>
                <button onClick={() => handleEditDog(dog.id)}>Edit</button>
                <button onClick={() => handleDeleteDog(dog.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {Array.from(
          { length: Math.ceil(dogs.length / itemsPerPage) },
          (_, index) => (
            <button key={index + 1} onClick={() => paginate(index + 1)}>
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default DogList;
