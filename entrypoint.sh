#!/bin/sh

echo "Applying migrations..."
npx prisma migrate deploy

echo "Starting app..."
exec "$@"