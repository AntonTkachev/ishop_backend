# IMarket

Realisation of simple internet shop.

Application realised with **Spring** boot and **ReactJS**.
In app exist possibility add new product, change it or delete.   
You can also add products to cart and place an order. Because of roles model there are different functional.   
Admin can change or delete **Users**, **Owner** add products, **User** only see and buy products.

### You can see the current function under:

- Register example:

![Registration new User - Animated gif](img/register.gif)

You can register like USER, OWNER or ADMIN:  
1. USER can add product to cart  
2. OWNER USER's credentials and create/change/delete product  
3. ADMIN OWNER's credentials and delete/change users  

![Roles](img/roles.png)

- Login example:

![Login - Animated gif](img/login.gif)

- Example product adding:

![Add new product - Animated gif](img/addProduct.gif)

- Example change pages and sort by price  
Like Admin you can delete or change product  

![Update product - Animated gif](img/product.gif)

- How to add a product to the cart and choose what you want to buy

![Order product - Animated gif](img/ordering.gif)


Stack:  
Java, Spring Boot, Spring WebMVC, JPA, Liquibase, JUnit, ReactJS

Data model:  
Order, Person, Product, Role  
The client forms an order from the products by specifying the number of units of the products.
Order can have statuses: new, paid for, delivered, cancelled.

JavaDoc on English, unit tests with theory TDD.

Build and testing project with Gradle.