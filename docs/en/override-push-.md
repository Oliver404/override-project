# Guía de Inicio Rápido
## Configuración de Plataformas
Para que Override Push funcione correctamente, es necesario configurar tu proyecto en ambas plataformas.
2.1.1. Google (FCM)
1.	Crea o accede a tu proyecto en la [Consola de Firebase].
2.	Registra tu aplicación Android.
3.	Descarga el archivo de configuración google-services.json y colócalo en el directorio raíz del módulo de tu aplicación (app/).
2.1.2. Huawei (HMS Push Kit)
1.	Crea o accede a tu proyecto en [AppGallery Connect].
2.	Habilita el servicio Push Kit en el menú Crecer > Push Kit.
3.	Descarga el archivo de configuración agconnect-services.json y colócalo en el directorio raíz del módulo de tu aplicación (app/).

### Google 
// Configracuion de Google
### Huawei
// Configuracion de Huawei
## Conifiguracion de librería
// Configuracion de nuestra libreria
# Implementación
## Obtener token
// Descripcion cd fucionalida de token
## Activar / Desactivar obtención automática de token
// DEscripcion para la funcionalidad de activar descativar automáticaemnte

# Apendices
## Creacion de Flavors


---- 

Me parece un buen esqueleto, pero podemos mejorarlo significativamente con un enfoque más estructurado, profesional y fácil de escanear. Además, usaré formatos de Markdown para guiar la vista del desarrollador.

Aquí tienes una versión mejorada y más completa, manteniendo la sencillez pero añadiendo el detalle técnico necesario:

-----

# 📖 Documentación de **Override Push**

## 🚀 1. Introducción y Propuesta de Valor

**Override Push** es una librería Android que simplifica la integración de **Firebase Cloud Messaging (FCM)** y **Huawei Push Kit (HMS)**, permitiendo a los desarrolladores utilizar un **único código base** para la gestión de notificaciones push en todas las variantes de la aplicación.

### ¿Cómo funciona?

Nuestra librería actúa como un *middleware* inteligente que detecta el entorno de ejecución (dispositivos con GMS o con HMS) y enruta las llamadas de manera transparente. Esto permite:

  * **Abstracción Total:** Maneja tokens y mensajes push con un conjunto de interfaces unificadas.
  * **Compilación por *Flavor*:** Utiliza los *Product Flavors* de Gradle para generar dos variantes de la aplicación (Google/Huawei), cada una con su propio conjunto de servicios y configuraciones.
  * **Cero Duplicación de Lógica:** Toda tu lógica de negocio para el manejo de tokens y la recepción de mensajes se escribe una sola vez.

-----

## 🛠️ 2. Guía de Inicio Rápido (Getting Started)

### 2.1. Preparación de Plataformas

Para que **Override Push** funcione correctamente, es necesario configurar tu proyecto en ambas plataformas.

#### 2.1.1. Google (FCM)

1.  Crea o accede a tu proyecto en la [Consola de Firebase].
2.  Registra tu aplicación Android.
3.  Descarga el archivo de configuración **`google-services.json`** y colócalo en el directorio raíz del módulo de tu aplicación (`app/`).

#### 2.1.2. Huawei (HMS Push Kit)

1.  Crea o accede a tu proyecto en [AppGallery Connect].
2.  Habilita el servicio **Push Kit** en el menú **Crecer \> Push Kit**.
3.  Descarga el archivo de configuración **`agconnect-services.json`** y colócalo en el directorio raíz del módulo de tu aplicación (`app/`).

### 2.2. Configuración de Gradle y *Flavors*

Esta es la clave de la integración. Necesitas configurar los *plugins* de Google y Huawei y definir tus *flavors*.

#### **A. Proyecto Nivel Raíz (`build.gradle.kts` o `build.gradle`)**

Asegúrate de que los repositorios y las dependencias de los *plugins* estén configurados:

```gradle
buildscript {
    repositories {
        // ...
        google()
        mavenCentral()
        maven { url 'https://developer.huawei.com/repo/' } // Repositorio de Huawei
    }
    dependencies {
        // ...
        classpath 'com.google.gms:google-services:4.4.1' // Versión actualizada
        classpath 'com.huawei.agconnect:agcp:1.9.1.300' // Versión actualizada
    }
}
```

#### **B. Módulo de Aplicación (`app/build.gradle.kts` o `app/build.gradle`)**

1.  **Aplica los Plugins y Añade la Librería:**
    Aplica los *plugins* de Google y Huawei al inicio del archivo, y añade la dependencia de tu librería.

    ```gradle
    // ¡Asegúrate de aplicar ambos plugins al inicio!
    apply plugin: 'com.android.application'
    apply plugin: 'com.google.gms.google-services'
    apply plugin: 'com.huawei.agconnect'

    dependencies {
        // ... otras dependencias
        implementation 'com.tudominio:override-push:[latest-version]' // Tu librería
    }
    ```

2.  **Define los *Product Flavors***:
    Define tus dos variantes clave para el proceso de compilación.

    ```gradle
    android {
        // ...
        productFlavors {
            google {
                // Se usará la configuración de FCM (google-services.json)
                dimension "pushService"
            }
            huawei {
                // Se usará la configuración de Push Kit (agconnect-services.json)
                dimension "pushService"
            }
        }
    }
    ```

-----

## 💻 3. Implementación de Código

Toda la interacción con el servicio Push se realiza a través de la interfaz unificada de **Override Push**.

### 3.1. Creación del Servicio de Mensajería

Extiende de nuestra clase base unificada, **`OverrideMessageService`**, e implementa los métodos clave:

```kotlin
class MyPushService : OverrideMessageService() {

    // 1. Manejo del Token: Se llama cada vez que se genera un nuevo token (FCM o HMS)
    override fun onNewToken(token: PushToken) {
        // 'token' contiene el valor y el tipo (FCM/HMS)
        Log.d("Push", "Nuevo Token: ${token.value}, Tipo: ${token.type}")
        // **Lógica:** Envía este token a tu servidor backend
    }

    // 2. Recepción de Mensajes: Se llama cuando se recibe un mensaje de datos
    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        // 'remoteMessage' es una abstracción de los datos de notificación
        Log.d("Push", "Mensaje Recibido: ${remoteMessage.data}")
        // **Lógica:** Procesar datos y mostrar notificación local
    }

    // ... otros métodos opcionales como onMessageSent, onSendError
}
```

### 3.2. Obtención Manual del Token

Puedes solicitar el token de registro actual en cualquier momento utilizando la instancia de la librería:

```kotlin
val currentToken = OverridePushManager.getInstance().getToken()
// Nota: En algunos dispositivos Huawei antiguos, esta llamada puede ser síncrona,
// pero el mejor canal para recibir el token sigue siendo 'onNewToken'.
```

### 3.3. Control de la Obtención Automática de Token (Opcional)

Si necesitas desactivar temporalmente la generación automática de tokens (por ejemplo, por motivos de privacidad o *opt-in*), usa el siguiente método:

```kotlin
// Desactivar la generación/obtención automática de tokens
OverridePushManager.getInstance().setAutoInitEnabled(false)

// Volver a activar la generación/obtención automática de tokens
OverridePushManager.getInstance().setAutoInitEnabled(true)
```

-----

## 📚 4. Apéndices

### 4.1. Referencia de Objetos Clave

| Objeto | Descripción | Propiedades Clave |
| :--- | :--- | :--- |
| **`PushToken`** | Contenedor unificado para el token de registro. | `value: String`, `type: PushType` |
| **`PushType`** | Enum que identifica el origen del token/mensaje. | `FCM`, `HMS` |
| **`RemoteMessage`** | Datos unificados del mensaje recibido. | `data: Map<String, String>`, `notification: NotificationPayload` |
| **`OverrideMessageService`** | Clase base unificada a implementar. | Métodos: `onNewToken`, `onMessageReceived` |

-----

¡Este esquema es mucho más robusto\! ¿Te gustaría que continuemos detallando una sección, por ejemplo, cómo manejar los datos recibidos dentro de `onMessageReceived`?