// Teste simples de detecção de plataforma
// Para ser executado no console do browser

function testPlatformDetection() {
  console.log('🧪 Testando detecção de plataforma...');
  
  // Simular diferentes tamanhos de tela
  const testCases = [
    { width: 768, expected: 'mobile', name: 'Tablet' },
    { width: 1023, expected: 'mobile', name: 'Tablet Large' },
    { width: 1024, expected: 'desktop', name: 'Desktop Small' },
    { width: 1920, expected: 'desktop', name: 'Desktop Full HD' },
  ];
  
  testCases.forEach(({ width, expected, name }) => {
    // Simular resize
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    
    // Testar media query
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const isDesktop = mediaQuery.matches;
    const platform = isDesktop ? 'desktop' : 'mobile';
    
    const status = platform === expected ? '✅' : '❌';
    console.log(`${status} ${name} (${width}px): ${platform} - Esperado: ${expected}`);
  });
}

// Testar se componentes certos estão sendo carregados
function testComponentLoading() {
  console.log('🧪 Testando carregamento de componentes...');
  
  // Verificar se lazy loading está configurado
  const hasLazyComponents = typeof React !== 'undefined' && React.lazy;
  console.log(hasLazyComponents ? '✅' : '❌', 'React.lazy disponível');
  
  // Verificar se hooks estão disponíveis
  const hasHooks = typeof React !== 'undefined' && React.useEffect;
  console.log(hasHooks ? '✅' : '❌', 'React Hooks disponível');
  
  return {
    lazyComponents: hasLazyComponents,
    hooks: hasHooks
  };
}

// Executar testes
if (typeof window !== 'undefined') {
  testPlatformDetection();
  testComponentLoading();
} else {
  console.log('❌ Testes devem ser executados no browser');
}