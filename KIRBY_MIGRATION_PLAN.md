# Kirby CMS Migration Plan for PPS Studio Website

## Current Architecture Analysis
- **Static Site**: Pure HTML/CSS/JS with ES6 modules
- **Media Structure**: Organized in `Medias/XX-ProjectName/` folders
- **Configuration**: JavaScript-based (`config.js` with project data)
- **Gallery System**: Custom lazy-loading with Intersection Observer
- **No Backend**: All content hardcoded in JS/HTML

## Kirby Architecture Design

### 1. Content Structure
```
content/
├── 1_projects/
│   ├── 1_present-futur/
│   │   ├── project.txt
│   │   └── media/
│   │       ├── 01_image.webp
│   │       └── 02_video.mp4
│   ├── 2_frac-auvergne/
│   ├── 3_palais-de-tokyo/
│   ├── 4_stereolux/
│   ├── 5_pygmalion/
│   └── 6_pili/
├── 2_info/
│   └── info.txt
├── 3_contact/
│   └── contact.txt
└── home/
    └── home.txt
```

### 2. Blueprints Structure

#### site.yml (Site Blueprint)
```yaml
title: Site
tabs:
  projects:
    label: Projects
    sections:
      projects:
        type: pages
        parent: site.find("projects")
        template: project
  settings:
    label: Settings
    fields:
      title:
        type: text
        label: Site Title
      description:
        type: textarea
        label: Site Description
```

#### project.yml (Project Blueprint)
```yaml
title: Project
fields:
  projectName:
    label: Project Name
    type: text
    required: true
  year:
    label: Year
    type: number
    width: 1/2
  title:
    label: Project Title
    type: text
  description:
    label: Description
    type: textarea
  credits:
    label: Credits
    type: structure
    fields:
      role:
        label: Role
        type: text
      people:
        label: People
        type: tags
  media:
    label: Media Files
    type: files
    query: page.images.add(page.videos)
    layout: cards
    sortable: true
```

### 3. Templates Structure

#### site/templates/default.php
```php
<?php snippet('header') ?>
<div class="gallery-container">
    <div class="gallery" id="gallery">
        <?php foreach($site->find('projects')->children()->listed() as $project): ?>
            <?= snippet('project', ['project' => $project]) ?>
        <?php endforeach ?>
    </div>
</div>
<?php snippet('footer') ?>
```

#### site/snippets/project.php
```php
<section class="gallery-section" data-section="<?= $project->uid() ?>">
    <?php foreach($project->files()->sortBy('sort') as $file): ?>
        <?php if($file->type() == 'image'): ?>
            <img
                class="lazy-media"
                data-src="<?= $file->url() ?>"
                alt="<?= $project->title() ?>"
            >
        <?php elseif($file->type() == 'video'): ?>
            <video
                class="lazy-media"
                data-src="<?= $file->url() ?>"
                autoplay muted loop playsinline
            ></video>
        <?php endif ?>
    <?php endforeach ?>

    <?= snippet('white-zone', ['project' => $project]) ?>
</section>
```

#### site/snippets/white-zone.php
```php
<div class="gallery-white-zone">
    <div class="white-zone-layout">
        <div class="white-zone-left">
            <div class="white-zone-title"><?= $project->projectName() ?></div>
            <div><?= $project->year() ?></div>
        </div>
        <div class="white-zone-center">
            <p><?= $project->description() ?></p>
        </div>
        <div class="white-zone-right">
            <?php if($project->credits()->isNotEmpty()): ?>
                <div class="white-zone-credits-header">Credits</div>
                <?php foreach($project->credits()->toStructure() as $credit): ?>
                    <div>
                        <span class="white-zone-credit-label"><?= $credit->role() ?>:</span>
                        <span class="credit-names"><?= implode(', ', $credit->people()->split()) ?></span>
                    </div>
                <?php endforeach ?>
            <?php endif ?>
        </div>
    </div>
</div>
```

### 4. Migration Steps

#### Phase 1: Kirby Setup
```bash
# Install Kirby via Composer
composer create-project getkirby/starterkit kirby-site
cd kirby-site

# Remove starter content
rm -rf content/*
rm -rf site/templates/*
rm -rf site/snippets/*
rm -rf site/blueprints/*
```

#### Phase 2: Content Migration Script
```php
<?php
// migrate.php - Run once to migrate content

$projects = [
    'present-futur' => [
        'title' => 'Présent><Futur',
        'year' => 2024,
        'description' => 'An immersive installation...',
        'credits' => [
            ['role' => 'Creative direction', 'people' => 'Hugo Ganet'],
            ['role' => 'Design', 'people' => 'Hugo Ganet, Marie Dupont']
        ],
        'mediaFolder' => '01-PF'
    ],
    // ... other projects
];

foreach($projects as $slug => $data) {
    // Create project page
    $projectPage = page('projects')->createChild([
        'slug' => $slug,
        'template' => 'project',
        'content' => $data
    ]);

    // Copy media files
    $sourceDir = './Medias/' . $data['mediaFolder'];
    $targetDir = $projectPage->root() . '/media';

    foreach(glob($sourceDir . '/*') as $file) {
        copy($file, $targetDir . '/' . basename($file));
    }
}
```

### 5. JavaScript Integration

#### Adapt existing modules for Kirby:
```javascript
// assets/js/config.js - Now loads from Kirby API
export async function loadProjectData() {
    const response = await fetch('/api/projects');
    return await response.json();
}

// assets/js/modules/gallery.js - Update paths
function loadMedia(element) {
    const src = element.dataset.src;
    // No changes needed - Kirby provides correct URLs
    element.src = src;
}
```

### 6. Kirby Panel Configuration

#### config/config.php
```php
<?php
return [
    'panel' => [
        'install' => true,
        'slug' => 'admin'
    ],
    'thumbs' => [
        'driver' => 'gd',
        'presets' => [
            'default' => ['width' => 1024, 'quality' => 90],
            'thumbnail' => ['width' => 400, 'height' => 300, 'crop' => true]
        ]
    ],
    'routes' => [
        [
            'pattern' => 'api/projects',
            'action'  => function() {
                return page('projects')->children()->listed()->toJson();
            }
        ]
    ]
];
```

### 7. Asset Management

#### .htaccess (for Apache)
```apache
# Kirby rewrite rules
RewriteEngine on
RewriteBase /

# Block access to Kirby system folders
RewriteRule ^(kirby|site|content)/(.*) error [R=301,L]

# Make assets accessible
RewriteRule ^assets/(.*) assets/$1 [L]
RewriteRule ^Medias/(.*) content/projects/$1 [L]

# Kirby routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*) index.php [L]
```

## Implementation Timeline

### Week 1: Foundation
- [ ] Install Kirby locally
- [ ] Create basic blueprints
- [ ] Set up templates structure
- [ ] Configure panel

### Week 2: Content Migration
- [ ] Write migration script
- [ ] Migrate all projects
- [ ] Set up media handling
- [ ] Test file uploads

### Week 3: Frontend Integration
- [ ] Convert HTML to Kirby templates
- [ ] Adapt JavaScript modules
- [ ] Preserve lazy loading
- [ ] Maintain responsive design

### Week 4: Testing & Deployment
- [ ] Test all features
- [ ] Optimize performance
- [ ] Set up production server
- [ ] Deploy and verify

## Key Advantages After Migration

1. **Content Management**: Edit projects via admin panel
2. **Dynamic Content**: No more hardcoded JS configs
3. **SEO**: Better URL structure and meta tags
4. **Scalability**: Easy to add new projects
5. **Media Management**: Automatic image optimization
6. **Multi-user**: Editor accounts for clients
7. **Version Control**: Content changes tracked

## Potential Challenges

1. **Media Migration**: Large video files need careful handling
2. **JavaScript Adaptation**: Ensure smooth integration with Kirby's routing
3. **Performance**: Maintain current lazy-loading efficiency
4. **URLs**: Implement redirects if URLs change

## Next Steps

1. **Backup** current site completely
2. **Set up** local Kirby development environment
3. **Start** with Phase 1: Basic Kirby installation
4. **Test** each migration phase thoroughly
5. **Document** any custom configurations