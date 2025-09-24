export const SystemConfigurationStyles = `

.configuration-content{
border-style: dotted !important;
}
.system-configuration {
    padding: 1rem;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
    box-sizing: border-box;
    width: 100vw;
    margin: 0;
    position: relative;
    left: 50%;
    right: 50%;
}

.configuration-card {
    width: 95vw;
    margin: 0 auto;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    border: none;
}

.configuration-card .p-card-body {
    padding: 0;
    width: 100%;
}

.configuration-card .p-card-content {
    padding: 0;
    width: 100%;
}

.card-header {
    background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
    color: white;
    padding: 1.5rem 2rem;
    width: 100%;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    width: 100%;
}

.title-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;
}

.title-icon {
    font-size: 2rem;
}

.title-section h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    white-space: nowrap;
}

.progress-badges {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    flex-shrink: 0;
}

.main-content {
    display: flex;
    min-height: 600px;
    width: 100%;
}

/* Stepper Sidebar */
.stepper-sidebar {
    background: #f8fafc;
    border-right: 1px solid #e2e8f0;
    padding: 1.5rem;
    overflow-y: auto;
    width: 320px;
    min-width: 320px;
    flex-shrink: 0;
}

.main-stepper {
    background: transparent;
    width: 100%;
}

.main-stepper .p-stepper-panel {
    margin: 0.5rem 0;
    border-radius: 8px;
    transition: all 0.3s ease;
    width: 100%;
}

.active-step {
    background: #ebf8ff;
    border-left: 4px solid #3182ce;
}

.sub-stepper {
    margin: 0.5rem 0 0.5rem 1rem;
    padding-left: 1rem;
    border-left: 2px solid #e2e8f0;
    width: 100%;
}

.sub-stepper .p-stepper-panel {
    margin: 0.25rem 0;
    padding: 0.5rem;
    border-radius: 6px;
    transition: all 0.3s ease;
    width: 100%;
}

.active-substep {
    background: #e6fffa;
    border-left: 3px solid #38b2ac;
}

/* Content Area */
.content-area {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    background: white;
    flex: 1;
    min-width: 0;
}

.content-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    width: 100%;
}

.step-info {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    width: 100%;
}

.step-icon {
    font-size: 2.5rem;
    color: #3182ce;
    margin-top: 0.25rem;
    flex-shrink: 0;
}

.step-info h2 {
    margin: 0 0 0.5rem 0;
    color: #2d3748;
    font-size: 1.5rem;
    font-weight: 600;
    width: 100%;
}

.step-info p {
    margin: 0;
    color: #4a5568;
    font-size: 1.1rem;
    font-weight: 500;
    width: 100%;
}

.component-container {
    flex: 1;
    margin-bottom: 2rem;
    min-height: 300px;
    width: 100%;
    min-width: 0;
}

.stepper-navigation {
    background: #f8fafc;
    padding: 1.5rem 2rem;
    border: 1px solid #e2e8f0 !important;
   
}

.nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    width: 100%;
}

.action-buttons {
    display: flex;
    gap: 0.5rem;
}

/* Contabilidad Config Styles */
.contabilidad-config {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    height: 100%;
    width: 100%;
}

.contabilidad-config .p-card {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    width: 100%;
}

.contabilidad-config .p-card .p-card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
}

.navigation-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    width: 100%;
}

.step-counter {
    font-weight: 600;
    color: #4a5568;
    font-size: 1rem;
}

/* Empresa Config Styles */
.empresa-configuration {
    width: 100%;
}

.empresa-configuration h4 {
    color: #2d3748;
    margin-bottom: 1.5rem;
    width: 100%;
}

.empresa-configuration .row {
    display: flex;
    gap: 1rem;
    margin: 0;
    width: 100%;
}

.empresa-configuration .row > * {
    flex: 1;
    min-width: 0;
}

.empresa-configuration .p-card {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    height: auto;
    width: 100%;
}

.empresa-configuration .p-card .p-card-title {
    color: #2d3748;
    font-weight: 600;
}

/* Especialidades Config Styles */
.especialidades-configuration {
    width: 100%;
}

.especialidades-configuration h4 {
    color: #2d3748;
    margin-bottom: 1.5rem;
    width: 100%;
}

.especialidades-configuration .d-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.especialidades-configuration .p-card {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    width: 100%;
}

/* Responsive Design */
@media (max-width: 1024px) {
    .stepper-sidebar {
        width: 280px;
        min-width: 280px;
    }
    
    .content-area {
        padding: 1.5rem;
    }
}

@media (max-width: 768px) {
    .system-configuration {
        padding: 0.5rem;
        width: 100vw;
    }
    
    .configuration-card {
        width: 99vw;
        max-width: 99vw;
    }
    
    .main-content {
        flex-direction: column;
        min-height: auto;
    }
    
    .stepper-sidebar {
        width: 100%;
        min-width: 100%;
        border-right: none;
        border-bottom: 1px solid #e2e8f0;
        max-height: 300px;
        overflow-y: auto;
        padding: 1rem;
    }
    
    .content-area {
        padding: 1rem;
        min-height: 400px;
        width: 100%;
    }
    
    .card-header {
        padding: 1rem 1.5rem;
    }
    
    .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
    }
    
    .title-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
    
    .title-section h1 {
        font-size: 1.25rem;
        white-space: normal;
    }
    
    .step-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
    
    .step-info h2 {
        font-size: 1.25rem;
    }
    
    .step-info p {
        font-size: 1rem;
    }
    
    .nav-content {
        flex-direction: column;
        gap: 1rem;
    }
    
    .action-buttons {
        order: -1;
        width: 100%;
        justify-content: center;
    }
    
    .empresa-configuration .row {
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .navigation-controls {
        flex-direction: column;
        gap: 0.75rem;
        padding: 0.75rem;
    }
    
    .step-counter {
        order: -1;
    }
    
    .stepper-navigation {
        margin: 0 -1rem -1rem;
        padding: 1rem;
        width: calc(100% + 2rem);
    }
}

@media (max-width: 480px) {
    .system-configuration {
        padding: 0.25rem;
        width: 100vw;
    }
    
    .configuration-card {
        width: 99.5vw;
        max-width: 99.5vw;
    }
    
    .card-header {
        padding: 0.75rem 1rem;
    }
    
    .title-icon {
        font-size: 1.5rem;
    }
    
    .title-section h1 {
        font-size: 1.1rem;
    }
    
    .stepper-sidebar {
        padding: 0.75rem;
        max-height: 250px;
    }
    
    .content-area {
        padding: 0.75rem;
    }
    
    .step-icon {
        font-size: 2rem;
    }
    
    .step-info h2 {
        font-size: 1.1rem;
    }
    
    .contabilidad-config .p-card .p-card-title {
        font-size: 1.1rem;
    }
    
    .stepper-navigation {
        margin: 0 -0.75rem -0.75rem;
        padding: 1rem 0.75rem;
        width: calc(100% + 1.5rem);
    }
    
    .action-buttons {
        flex-direction: column;
        width: 100%;
    }
    
    .action-buttons .p-button {
        width: 100%;
        margin-bottom: 0.5rem;
    }
}

/* Scrollbar Styling */
.stepper-sidebar::-webkit-scrollbar {
    width: 6px;
}

.stepper-sidebar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.stepper-sidebar::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 3px;
}

.stepper-sidebar::-webkit-scrollbar-thumb:hover {
    background: #a0aec0;
}

/* Ensure proper box sizing */
.system-configuration * {
    box-sizing: border-box;
}

/* Input field responsiveness */
.p-inputtext {
    width: 100% !important;
    max-width: 100%;
}

/* Button responsiveness */
.p-button {
    white-space: nowrap;
    min-width: auto;
}

@media (max-width: 768px) {
    .p-button {
        width: 100%;
        justify-content: center;
    }
    
    .nav-content .p-button {
        width: auto;
    }
}

/* Force full viewport width */
.system-configuration {
    left: 0;
    right: 0;
    margin-left: 0;
    margin-right: 0;
    width: 100vw !important;
}

.configuration-card {
    max-width: 100vw !important;
    border-radius: 0;
}

/* Remove any horizontal padding on mobile */
@media (max-width: 768px) {
    .system-configuration {
        padding: 0;
    }
    
    .configuration-card {
        border-radius: 0;
        box-shadow: none;
    }
}

/* Ensure full width for all containers */
.main-content,
.stepper-sidebar,
.content-area,
.component-container {
    max-width: 100% !important;
}
`;