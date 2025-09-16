package zdeb

import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.application.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.http.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.util.concurrent.atomic.AtomicInteger

@Serializable
data class Product(val id: Int, val name: String, val price: Double)

@Serializable
data class CartItem(val productId: Int, val quantity: Int)

@Serializable
data class CartPayload(val items: List<CartItem>)

@Serializable
data class CartResponse(val totalItems: Int, val totalPrice: Double, val message: String)

@Serializable
data class PaymentPayload(val name: String, val cardNumber: String, val amount: Double)

@Serializable
data class PaymentResponse(val succeeded: Boolean, val message: String, val paymentId: Int)

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0") {
        module()
    }.start(wait = true)
}

fun Application.module() {
    install(ContentNegotiation) {
        json(Json { prettyPrint = true })
    }

    install(CORS) {
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowHeader(HttpHeaders.ContentType)
        allowHost("localhost:3000", schemes = listOf("http"))
        anyHost()
    }

    // In-memory product list
    val products = listOf(
        Product(1, "Kubek ceramiczny", 12.50),
        Product(2, "Notes A5", 8.20),
        Product(3, "Długopis żelowy", 3.00),
        Product(4, "Torba materiałowa", 25.0)
    )

    val paymentCounter = AtomicInteger(1000)

    routing {
        get("/") {
            call.respondText("Kotlin Ktor server is running", ContentType.Text.Plain)
        }

        get("/products") {
            call.respond(products)
        }

        post("/cart") {
            val payload = call.receive<CartPayload>()
            var totalItems = 0
            var totalPrice = 0.0
            payload.items.forEach { item ->
                val prod = products.find { it.id == item.productId }
                if (prod != null) {
                    totalItems += item.quantity
                    totalPrice += prod.price * item.quantity
                }
            }
            call.respond(CartResponse(totalItems, totalPrice, "Cart processed on server"))
        }

        post("/payments") {
            val payload = call.receive<PaymentPayload>()
            val id = paymentCounter.incrementAndGet()
            call.respond(PaymentResponse(true, "Payment accepted", id))
        }
    }
}
