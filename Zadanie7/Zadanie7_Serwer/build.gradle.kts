import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm") version "1.9.10"
    application
    kotlin("plugin.serialization") version "1.9.10"
    id("org.jlleitschuh.gradle.ktlint") version "11.5.0"
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("io.ktor:ktor-server-core-jvm:2.3.4")
    implementation("io.ktor:ktor-server-netty-jvm:2.3.4")
    implementation("io.ktor:ktor-server-content-negotiation:2.3.4")
    implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.4")
    implementation("io.ktor:ktor-server-cors:2.3.4")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.0")
    testImplementation("io.ktor:ktor-server-tests-jvm:2.3.4")
}

application {
    mainClass.set("zdeb.ApplicationKt")
}

kotlin {
    jvmToolchain(20)
}

ktlint {
    verbose.set(true)
    android.set(false)
    outputToConsole.set(true)
    ignoreFailures.set(false) // blokuje build przy błędach
    enableExperimentalRules.set(true)
}