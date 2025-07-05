let userArr = JSON.parse(localStorage.getItem("users")) || [];

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn_owner");
    const box = document.getElementById("box");
    const postCarBtn = document.getElementById('ownerAdd');
    const loginBtn = document.getElementById("btnSignin");
    const LoginAsClientBtn = document.getElementById('LoginAsClientBtn');
    const signUpBtn = document.getElementById("sign_upbtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", LoginUser);
    }

    if (postCarBtn) {
        postCarBtn.addEventListener("click", createPost);
    }

    if (LoginAsClientBtn) {
        LoginAsClientBtn.addEventListener('click', function redirect() {
            window.location.href = 'login.html';
            LoginAsClientBtn.removeEventListener('click', redirect);
        });
    }

    if (signUpBtn) {
        signUpBtn.addEventListener("click", registerUser);
    }

    if (btn && box) {
        btn.addEventListener("click", () => {
            box.innerHTML = "";

            let nameInput = document.createElement("input");
            nameInput.type = "text";
            nameInput.id = "ownerName";
            nameInput.placeholder = "Enter Name";

            let passInput = document.createElement("input");
            passInput.type = "password";
            passInput.id = "ownerPass";
            passInput.placeholder = "Enter Password";

            let submitBtn = document.createElement("button");
            submitBtn.id = "submitOwner";
            submitBtn.textContent = "Submit";

            box.appendChild(nameInput);
            box.appendChild(passInput);
            box.appendChild(submitBtn);

            submitBtn.addEventListener("click", () => {
                let name = document.getElementById("ownerName").value;
                let pass = document.getElementById("ownerPass").value;

                if (name === "admin" && pass === "admin") {
                    window.location.href = "owner.html";
                } else {
                    alert("Invalid Name or Password!");
                }
            });
        });
    }


    if (window.location.pathname.endsWith("home.html")) {
        showCarsHome();
    }

    
    showCart(); 
});

function LoginUser() {
    let userName = document.getElementById("userName");
    let userPassword = document.getElementById("userPassword");

    if (!userName || !userPassword) {
        console.error("Login input fields not found");
        return;
    }

    const name = userName.value.trim();
    const pass = userPassword.value.trim();

    if (name === "" || pass === "") {
        alert("Please fill all fields");
        return;
    }

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = storedUsers.find(
        (user) => user.name === name && user.pass === pass
    );

    if (foundUser) {
        localStorage.setItem("loggedInAs", "User");
        localStorage.setItem("user", JSON.stringify(foundUser));
        alert("Login successful!");
        window.location.href = "home.html";
    } else {
        alert("Invalid username or password");
    }
}

function registerUser() {
    let name = document.getElementById("namesign")?.value.trim();
    let pass = document.getElementById("passwordsign")?.value.trim();

    if (!name || !pass) {
        alert("Please fill all fields");
        return;
    }

    let existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    let alreadyExists = existingUsers.filter((user) => user.name === name);

    if (alreadyExists.length > 0) {
        alert("Username already exists");
        return;
    }

    let newUser = {
        name: name,
        pass: pass
    };

    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    alert("Registration successful! Please log in.");
    window.location.href = "login.html";
}

function createPost() {
    let carname = document.getElementById("name").value.trim();
    let carmodel = document.getElementById("model").value.trim();
    let carprice = document.getElementById("price").value.trim();
    let imageUrl = document.getElementById("imageUrl").value.trim();

    if (!carname || !carmodel || !carprice || !imageUrl) {
        alert("Please fill all fields to post the car.");
        return;
    }

    const carData = {
        name: carname,
        model: carmodel,
        price: carprice,
        imageUrl: imageUrl
    };

    const carList = JSON.parse(localStorage.getItem("cars") || [] );
    carList.push(carData);
    localStorage.setItem("cars", JSON.stringify(carList));

    window.location.href = "home.html";
}

function showCarsHome() {
    const carList = JSON.parse(localStorage.getItem("cars")) || [];
    const container = document.getElementById("carContainer");


    if (carList.length === 0) {
        container.innerHTML = "<p>No cars posted yet.</p>";
        return;
    }

    container.innerHTML = "";

    carList.forEach((car, index) => {
        const card = document.createElement("div");
        card.className = "car-card";

        card.innerHTML = `
            <img src="${car.imageUrl}" alt="${car.name}" width="200">
            <h3>${car.name}</h3>
            <p>Model: ${car.model}</p>
            <p>Price: ${car.price} RS</p>
            <button class="addToCartBtn" data-index="${index}">Add to Cart</button>
        `;

        container.appendChild(card);
    });

    const addToCartButtons = document.querySelectorAll(".addToCartBtn");

    addToCartButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            const carIndex = parseInt(this.getAttribute("data-index"));
            const selectedCar = carList[carIndex];

            let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

            let alreadyInCart = cart.some(
                (item) => item.name === selectedCar.name && item.model === selectedCar.model
            );

            if (alreadyInCart) {
                alert("This car is already Booked");
                return;
            }

            cart.push(selectedCar);
            localStorage.setItem("cartItems", JSON.stringify(cart));

            alert("Car added to cart!");
        });
    });
}

function showCart() {
    const cartContainer = document.getElementById("cartContainer");
    const emptyMsg = document.getElementById("empty");

    if (!cartContainer || !emptyMsg) return;

    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    if (cartItems.length === 0) {
        emptyMsg.textContent = "You don't have any bookings right now.";
        return;
    }

    cartContainer.innerHTML = "";

    cartItems.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "car-card";

        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" width="200">
            <h3>${item.name}</h3>
            <p>Model: ${item.model}</p>
            <p>Price: ${item.price} RS</p>
            <button class="removeBtn" data-index="${index}">Remove</button>
        `;

        cartContainer.appendChild(card);
    });

    cartContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("removeBtn")) {
            const index = parseInt(e.target.getAttribute("data-index"));
            let updatedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
            updatedCart.splice(index, 1);
            localStorage.setItem("cartItems", JSON.stringify(updatedCart));
            location.reload();
        }
    });
}