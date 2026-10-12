<div class="contenedor olvide">
    <?php
        include_once __DIR__ . '/../templates/nombre-sitio.php';
    ?>

    <div class="contenedor-sm">
        <p class="descripcion-pagina">Recupera tu Password</p>

        <?php
            include_once __DIR__ . '/../templates/alertas.php';
        ?>

        <form class="formulario" method="POST" action="/olvide" novalidate> <!--novalidate para decirle que se esté quieto-->
            <div class="campo">
                <label for="email">Email</label>

                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Tu Email"
                />
            </div>

            <input type="submit" class="boton" value="Enviar Instrucciones">
        </form>

        <div class="acciones">
            <a class="" href="/">¿Ya tienes cuenta? Iniciar Sesión</a>
            <a class="" href="/crear">¿Aún no tienes una cuenta? Obtener una</a>
        </div>
    </div> <!--Contenedor sm-->
</div>