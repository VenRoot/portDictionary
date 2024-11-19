# Deno Base Image
FROM denoland/deno:alpine

# Create non-root user with flexible UID/GID
RUN addgroup -S deno || :
RUN adduser -S deno -G deno || :
# RUN usermod -aG deno deno

WORKDIR /app

# Ensure proper permissions
COPY --chown=deno:deno . .

USER deno

CMD ["sh"]
