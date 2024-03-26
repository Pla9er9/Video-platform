#[macro_use] extern crate rocket;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[post("/login")]
fn login() -> &'static str {
    "Login"
}

#[post("/register")]
fn register() -> &'static str {
    "Registration"
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![index])
        .mount("/", routes![login])
        .mount("/", routes![register])
}
