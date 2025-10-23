import React from 'react';
import { ScrollView } from 'react-native';
import {
  ResponsiveScreen,
  ResponsiveContainer,
  ResponsiveText,
  ResponsiveView,
  ResponsiveButton,
  ResponsiveImage,
  ResponsiveGrid,
  useResponsive,
} from '../components/Responsive';

const ResponsiveExample = () => {
  const { rw, rh, rf, isSmall, isMedium, isLarge } = useResponsive();

  return (
    <ResponsiveScreen backgroundColor="#F5F5F5" padding={16}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ResponsiveContainer>
          {/* Header */}
          <ResponsiveView
            padding={{ bottom: 20 }}
            align="center"
          >
            <ResponsiveText
              size="3xl"
              weight="bold"
              color="#333"
              align="center"
            >
              Responsive Design Example
            </ResponsiveText>
            <ResponsiveText
              size="md"
              color="#666"
              align="center"
              style={{ marginTop: 8 }}
            >
              Screen Size: {isSmall ? 'Small' : isMedium ? 'Medium' : isLarge ? 'Large' : 'Extra Large'}
            </ResponsiveText>
          </ResponsiveView>

          {/* Cards Grid */}
          <ResponsiveGrid columns={2} gap={16} padding={0}>
            {[1, 2, 3, 4].map((item) => (
              <ResponsiveView
                key={item}
                backgroundColor="#FFFFFF"
                padding={16}
                borderRadius={12}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <ResponsiveImage
                  source={{ uri: `https://picsum.photos/200/150?random=${item}` }}
                  width={rw(150)}
                  height={rh(100)}
                  borderRadius={8}
                />
                <ResponsiveText
                  size="lg"
                  weight="semibold"
                  color="#333"
                  style={{ marginTop: 8 }}
                >
                  Card {item}
                </ResponsiveText>
                <ResponsiveText
                  size="sm"
                  color="#666"
                  style={{ marginTop: 4 }}
                >
                  This is a responsive card that adapts to different screen sizes.
                </ResponsiveText>
              </ResponsiveView>
            ))}
          </ResponsiveGrid>

          {/* Buttons Section */}
          <ResponsiveView
            padding={{ top: 24, bottom: 16 }}
            align="center"
          >
            <ResponsiveText
              size="2xl"
              weight="bold"
              color="#333"
              style={{ marginBottom: 16 }}
            >
              Responsive Buttons
            </ResponsiveText>
            
            <ResponsiveView
              direction="row"
              wrap="wrap"
              justify="center"
              style={{ gap: 12 }}
            >
              <ResponsiveButton
                variant="primary"
                size="md"
                onPress={() => console.log('Primary button pressed')}
              >
                Primary
              </ResponsiveButton>
              
              <ResponsiveButton
                variant="secondary"
                size="md"
                onPress={() => console.log('Secondary button pressed')}
              >
                Secondary
              </ResponsiveButton>
              
              <ResponsiveButton
                variant="outline"
                size="md"
                onPress={() => console.log('Outline button pressed')}
              >
                Outline
              </ResponsiveButton>
            </ResponsiveView>
          </ResponsiveView>

          {/* Typography Section */}
          <ResponsiveView
            backgroundColor="#FFFFFF"
            padding={20}
            borderRadius={12}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <ResponsiveText
              size="2xl"
              weight="bold"
              color="#333"
              style={{ marginBottom: 16 }}
            >
              Responsive Typography
            </ResponsiveText>
            
            <ResponsiveText
              size="6xl"
              weight="bold"
              color="#007AFF"
              style={{ marginBottom: 8 }}
            >
              Heading 1
            </ResponsiveText>
            
            <ResponsiveText
              size="5xl"
              weight="bold"
              color="#333"
              style={{ marginBottom: 8 }}
            >
              Heading 2
            </ResponsiveText>
            
            <ResponsiveText
              size="4xl"
              weight="semibold"
              color="#333"
              style={{ marginBottom: 8 }}
            >
              Heading 3
            </ResponsiveText>
            
            <ResponsiveText
              size="lg"
              color="#666"
              style={{ marginBottom: 8 }}
            >
              This is a large body text that scales with screen size.
            </ResponsiveText>
            
            <ResponsiveText
              size="md"
              color="#666"
              style={{ marginBottom: 8 }}
            >
              This is medium body text for regular content.
            </ResponsiveText>
            
            <ResponsiveText
              size="sm"
              color="#999"
            >
              This is small caption text for additional information.
            </ResponsiveText>
          </ResponsiveView>

          {/* Spacing Example */}
          <ResponsiveView
            padding={{ top: 24, bottom: 16 }}
          >
            <ResponsiveText
              size="2xl"
              weight="bold"
              color="#333"
              style={{ marginBottom: 16 }}
            >
              Responsive Spacing
            </ResponsiveText>
            
            <ResponsiveView
              backgroundColor="#E3F2FD"
              padding={16}
              borderRadius={8}
              style={{ marginBottom: 12 }}
            >
              <ResponsiveText size="md" color="#1976D2">
                Small spacing (12px)
              </ResponsiveText>
            </ResponsiveView>
            
            <ResponsiveView
              backgroundColor="#E8F5E8"
              padding={20}
              borderRadius={8}
              style={{ marginBottom: 12 }}
            >
              <ResponsiveText size="md" color="#388E3C">
                Medium spacing (16px)
              </ResponsiveText>
            </ResponsiveView>
            
            <ResponsiveView
              backgroundColor="#FFF3E0"
              padding={24}
              borderRadius={8}
            >
              <ResponsiveText size="md" color="#F57C00">
                Large spacing (20px)
              </ResponsiveText>
            </ResponsiveView>
          </ResponsiveView>
        </ResponsiveContainer>
      </ScrollView>
    </ResponsiveScreen>
  );
};

export default ResponsiveExample;
