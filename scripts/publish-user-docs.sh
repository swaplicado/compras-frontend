#!/usr/bin/env bash
# Copia la documentación pública de usuario al portal swaplicado/documentacion.
#
# Uso: scripts/publish-user-docs.sh <ruta-del-repositorio-documentacion>
#
# Solo se publican los archivos de la lista PUBLIC_DOCS. No agregues aquí
# documentación de desarrollo, configuración ni archivos con datos internos:
# todo lo que se copie al portal es público.
set -euo pipefail

SLUG="portal-compras"

# origen (en este repositorio) => destino (dentro de projects/$SLUG/)
PUBLIC_DOCS=(
  "docs/portal-index.md=index.md"
  "docs/para-usuarios.md=para-usuarios.md"
)

if [[ $# -ne 1 ]]; then
  echo "Uso: $0 <ruta-del-repositorio-documentacion>" >&2
  exit 2
fi

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
portal_root="$(cd "$1" && pwd)"

if [[ ! -f "$portal_root/_config.yml" || ! -d "$portal_root/projects" ]]; then
  echo "Error: $portal_root no parece ser el repositorio swaplicado/documentacion." >&2
  exit 1
fi

dest_dir="$portal_root/projects/$SLUG"
mkdir -p "$dest_dir"

for entry in "${PUBLIC_DOCS[@]}"; do
  src="$repo_root/${entry%%=*}"
  dest="$dest_dir/${entry#*=}"

  if [[ ! -f "$src" ]]; then
    echo "Error: no existe $src" >&2
    exit 1
  fi
  # Cada página necesita front matter con title y description.
  if [[ "$(head -n 1 "$src")" != "---" ]] \
    || ! awk 'NR>1 && /^---$/ {exit} NR>1' "$src" | grep -q '^title:' \
    || ! awk 'NR>1 && /^---$/ {exit} NR>1' "$src" | grep -q '^description:'; then
    echo "Error: $src debe iniciar con front matter que incluya title y description." >&2
    exit 1
  fi

  cp "$src" "$dest"
  echo "Publicado: ${entry%%=*} -> projects/$SLUG/${entry#*=}"
done
